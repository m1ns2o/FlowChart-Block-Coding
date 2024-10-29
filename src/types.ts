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

  export interface Problem {
    ID: number;
    Title: string;
    Content: string;
    TestcaseInput: string;
    TestcaseOutput: string;
    ClassID: 0;
  }