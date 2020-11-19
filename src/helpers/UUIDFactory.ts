import { randomInt } from "crypto";

export default abstract class UUIDFactory {
  public static uuidv4(): string {
    function getUUIDChar(char: string) {
      if (char === "y") {
        const array = ["8", "9", "a", "b"];
        return array[Math.floor(Math.random() * array.length)];
      }

      return randomInt(0, 15).toString(16);
    }

    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, getUUIDChar);
  }
}
