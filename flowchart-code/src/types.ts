export enum FlowchartComponentType {
    START = 'START',
    PROCESS = 'PROCESS',
    DECISION = 'DECISION',
    END = 'END'
  }
  
  export interface FlowchartComponent {
    id: number;
    type: FlowchartComponentType;
    label: string;
    x: number;
    y: number;
  }