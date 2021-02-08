export default interface IPaginatedModel<TResults> {
  qyt: number;
  page: number;
  results: TResults[];
  total: number;
  pages: number;
}
