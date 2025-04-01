using System.Diagnostics;
using System.Net;
using System.Net.Sockets;

namespace TadpoleSite.Server.ServiceClass
{
    public class ServiceBase
    {
        public Stopwatch Watch { get; set; }
        public DateTime ServiceStartTime { get; set; }

        public ServiceBase()
        {
        }

        // Overloaded WS Socket Handler - supports assigning custom IP Endpoint, and timing serving for PERF monitoring.
        public SocketsHttpHandler getSocketHandler()
        {
            // Get REST WS
            SocketsHttpHandler socketsHandler = new();

            Watch = Stopwatch.StartNew();
            ServiceStartTime = DateTime.Now;

            socketsHandler.ConnectCallback = async (context, token) =>
            {
                var s = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);

                string connectionString = ServiceCommon.serverIP;
                if (ServiceCommon.serverIP != "")
                {
                    s.Bind(new IPEndPoint(IPAddress.Parse(ServiceCommon.serverIP), 0));
                }
                else
                {
                    s.Bind(new IPEndPoint(IPAddress.Any, 0));
                }

                await s.ConnectAsync(context.DnsEndPoint, token);

                s.NoDelay = true;

                return new NetworkStream(s, ownsSocket: true);
            };

            return socketsHandler;
        }

    }
}
