namespace TadpoleSite.Server.ServiceClass
{
    /// <summary>
    ///  JSend is a specification that lays down some rules for how JSON responses from web servers should be formatted
    ///  https://github.com/omniti-labs/jsend
    /// </summary>
    public class JSend
    {
        public string status { get; set; }
        public object data { get; set; }
    }
}
