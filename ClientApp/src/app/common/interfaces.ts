
interface JSend<dataObject> {
  status: string;
  data: dataObject;
}

interface Distribution {
  priorMonth: DistributionMonth;
  currentMonth: DistributionMonth;
}
interface DistributionMonth {
  month: string;
  year: number;
  total: number;
  epr: number;
}

export { 
  JSend,
  DistributionMonth,
  Distribution
}
