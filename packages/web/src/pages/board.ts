import { Page } from '../page';
import '@mazdik-lib/board';
import { BoardComponent, BoardColumn, BoardEventArgs } from '@mazdik-lib/board';

export default class BoardDemo implements Page {

  get template(): string {
    return `<web-board class="board-demo"></web-board>`;
  }

  load() {
    const component = document.querySelector('web-board') as BoardComponent;
    component.boardColumns = this.getData();
    component.addEventListener('boardChange', (event: CustomEvent<BoardEventArgs>) => {
      console.log(event.detail);
    });
  }

  private getData(): BoardColumn[] {
    return [
      {
        id: 1,
        name: 'To Do',
        cards: [
          { id: 1, name: 'Task 1', text: 'Write a program that prints ‘Hello World’ to the screen' },
          { id: 2, name: 'Task 2', text: 'Write a program that asks the user for their name and greets them with their name' },
          { id: 3, name: 'Task 3', text: 'Modify the previous program such that only the users Alice and Bob are greeted with their names' },
        ]
      },
      {
        id: 2,
        name: 'In progress',
        cards: [
          { id: 4, name: 'Task 4', text: 'Write a program that asks the user for a number n and prints the sum of the numbers 1 to n' },
          { id: 5, name: 'Task 5', text: 'Modify the previous program such that only multiples of three or five are considered in the sum' },
          { id: 6, name: 'Task 6', text: 'Write a program that prints a multiplication table for numbers up to 12' },
        ]
      },
      {
        id: 3,
        name: 'Testing',
        cards: [
          { id: 7, name: 'Task 7', text: 'Write a function that returns the largest element in a list' },
          { id: 8, name: 'Task 8', text: 'Write function that reverses a list, preferably in place' },
          { id: 9, name: 'Task 9', text: 'Write a function that checks whether an element occurs in a list' },
        ]
      },
      {
        id: 4,
        name: 'Approval',
        cards: [
          { id: 10, name: 'Task 10', text: 'Write a function that returns the elements on odd positions in a list' },
          { id: 11, name: 'Task 11', text: 'Write a function that computes the running total of a list' },
          { id: 12, name: 'Task 12', text: 'Write a function that tests whether a string is a palindrome' },
        ]
      },
      {
        id: 5,
        name: 'Done',
        cards: [
          { id: 13, name: 'Task 13', text: 'Write a program that prints all prime numbers' },
          { id: 14, name: 'Task 14', text: 'Write a guessing game where the user has to guess a secret number' },
          { id: 15, name: 'Task 15', text: 'Write a program that prints the next 20 leap years' },
        ]
      },
    ];
  }

}
