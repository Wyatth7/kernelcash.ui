type GreetingWithSpan = {
  start: Date;
  end: Date;
  message: 'Howdy'
}

/**
 * Makes a friendly greeting based on the time of day.
 */
export class Greetings {
  private readonly greetings: {} = {

  }

  public static localTimeGreeting(): string {
    return ''
  }

}
