export default class StorageRealod {
  static reloadWithMessage(storageFieldName: string, message: string): void {
    localStorage.setItem(storageFieldName, message);
    location.reload();
  }
}
