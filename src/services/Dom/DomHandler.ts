export class DomHandler {
  static passIframe(parentId: string, dataUrl: string): void {
    const targetElement: HTMLElement = document.getElementById(parentId) as HTMLElement;
    const iframe = document.createElement("iframe");
    iframe.src = dataUrl;
    iframe.width = "100%";
    iframe.height = "100%";
    targetElement.appendChild(iframe);
  }
}
