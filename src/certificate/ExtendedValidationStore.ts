class EVInfo {
  constructor(readonly oid: string, readonly oidName: string) {}
}

export default class ExtendedValidationStore {
  readonly evStore: EVInfo[];
  constructor() {
    this.evStore.push(
      new EVInfo(
        "1.3.6.1.4.1.13769.666.666.666.1.500.9.1",
        "DEBUGtesting EV OID"
      ),
      new EVInfo("1.3.6.1.4.1.6334.1.100.1", "Cybertrust EV OID"),
      new EVInfo("2.16.756.1.89.1.2.1.1", "SwissSign EV OID"),
      new EVInfo("2.16.840.1.114404.1.1.2.4.1", "Trustwave EV OID"),
      new EVInfo("1.3.6.1.4.1.6449.1.2.1.5.1", "Comodo EV OID"),
      new EVInfo("2.16.840.1.114413.1.7.23.3", "Go Daddy EV OID"),
      new EVInfo("2.16.840.1.114412.2.1", "DigiCert EV OID"),
      new EVInfo("1.3.6.1.4.1.8024.0.2.100.1.2", "Quo Vadis EV OID"),
      new EVInfo("1.3.6.1.4.1.782.1.2.1.8.1", "Network Solutions EV OID"),
      new EVInfo("2.16.840.1.114028.10.1.2", "Entrust EV OID"),
      new EVInfo("2.23.140.1.1", "CA/Browser Forum EV OID"),
      new EVInfo("2.16.578.1.26.1.3.3", "Buypass EV OID") //Zeile 362
    );
  }
}
