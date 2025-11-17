export class DateUtils {
 static addMonthsTomDate(months: number, date?: Date): Date {
    if (!date) date = new Date();

    return new Date(date.getFullYear(), date.getMonth() + months, date.getDate());
  }

  static thisMonth(): [Date, Date] {
   const date = new Date();
   return [new Date(date.getFullYear(), date.getMonth(), 1), new Date(date.getFullYear(), date.getMonth() + 1, 0)]
  }

  static convertDateToDateTime(date: Date, startOfDay = true): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);

    return `${year}-${month}-${day}T${
      startOfDay ? '00:00:00.0' : '23:59:59.999'
    }`;
  }
}
