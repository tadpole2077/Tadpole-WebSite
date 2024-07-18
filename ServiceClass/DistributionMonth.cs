namespace Angular_VS_TEST.ServiceClass
{
    public class Distribution
    {
        public DistributionMonth priorMonth { get; set; }

        public DistributionMonth currentMonth { get; set; }

    }

    public class DistributionMonth
    {
        public int monthNumber { get; set; }
        public string month {  get; set; }
        public int year{ get; set; }
        public decimal total { get; set; }
        public decimal EPR { get; set; }
        public int day {  get; set; }
    }

    public class DistributeInstance
    {
        public decimal total { get; set; }
        public decimal EPR { get; set; }
    }
}
