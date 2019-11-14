import { BusinessNode, Edge } from "./data";

export abstract class NodesView {
    constructor(public nodes: BusinessNode[], public edges: Edge[], public container: HTMLElement) {
    }
    abstract init(): void;
    hide(): void {
        this.container.style.display = 'none';
    }
    show(): void {
        this.container.style.display = '';
    }
    abstract applyNodeFilter(filter: (node: BusinessNode) => boolean): void;
    abstract applyEdgeFilter(filter: (edge: Edge) => boolean): void;

    abstract setTooltipHandler(callback: (node: BusinessNode) => any): void;
}