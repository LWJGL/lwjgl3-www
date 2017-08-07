declare module 'file-saver' {
  declare export function saveAs(blob: Blob, filename: string): void;

  declare class FileSaver {
    saveAs: saveAs,
  }

  declare export default FileSaver
}
