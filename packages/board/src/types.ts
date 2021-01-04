export interface BoardColumn {
  id: number;
  name: string;
  cards: BoardCard[];
}

export interface BoardCard {
  id: number;
  name: string;
  text: string;
  data?: any;
}

export interface BoardEventArgs {
  columnId: number;
  movedCard: BoardCard;
  type: 'move' | 'reorder';
}
