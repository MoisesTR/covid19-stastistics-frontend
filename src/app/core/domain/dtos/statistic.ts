export interface AddNewCaseDto {
  statisticId: string;
  active: number;
  critical: number;
  newCases: number;
  recovered: number;
}

export interface AddNewDeathDto {
  statisticId: string;
  newCases: number;
}

export interface AddNewTestDto {
  statisticId: string;
  newTests: number;
}
