import { Page } from '../page';
import html from './drag-drop.html';
import { DragDrop } from '@mazdik-lib/drag-drop';

class Item {
  name: string;
  text: string;
}

export default class DragDropDemo implements Page {

  get template(): string { return html; }

  private dragDrop: DragDrop;

  load() {
    const data: Item[][] = [
      [
        { name: 'Task 1', text: 'Write a program that prints ‘Hello World’ to the screen' },
        { name: 'Task 2', text: 'Write a program that asks the user for their name and greets them with their name' },
        { name: 'Task 3', text: 'Modify the previous program such that only the users Alice and Bob are greeted with their names' },
      ],
      [
        { name: 'Task 4', text: 'Write a program that asks the user for a number n and prints the sum of the numbers 1 to n' },
        { name: 'Task 5', text: 'Modify the previous program such that only multiples of three or five are considered in the sum' },
        { name: 'Task 6', text: 'Write a program that prints a multiplication table for numbers up to 12' },
      ],
      [
        { name: 'Task 7', text: 'Write a function that returns the largest element in a list' },
        { name: 'Task 8', text: 'Write function that reverses a list, preferably in place' },
        { name: 'Task 9', text: 'Write a function that checks whether an element occurs in a list' },
      ],
      [
        { name: 'Task 10', text: 'Write a function that returns the elements on odd positions in a list' },
        { name: 'Task 11', text: 'Write a function that computes the running total of a list' },
        { name: 'Task 12', text: 'Write a function that tests whether a string is a palindrome' },
      ],
      [
        { name: 'Task 13', text: 'Write a program that prints all prime numbers' },
        { name: 'Task 14', text: 'Write a guessing game where the user has to guess a secret number' },
        { name: 'Task 15', text: 'Write a program that prints the next 20 leap years' },
      ]
    ];

    function createIssues(items: Item[]): HTMLElement[] {
      const elements = [];

      items.forEach(option => {
        const issue = document.createElement('div');
        issue.className = 'dd-issue';

        const title = document.createElement('div');
        title.className = 'dd-title';
        title.textContent = option.name;
        issue.append(title);

        const text = document.createElement('div');
        text.className = 'dd-text';
        text.textContent = option.text;
        issue.append(text);

        elements.push(issue);
      });

      return elements;
    }

    function createColumns() {
      const columnElements = [];
      let issueElements = [];

      data.forEach(item => {
        const column = document.createElement('div');
        column.className = 'dd-column';
        const issues = createIssues(item);
        column.append(...issues);

        issueElements = issueElements.concat(issues);
        columnElements.push(column);
      });
      return { columnElements, issueElements };
    }

    const div = document.querySelector('#drag-drop-demo') as HTMLDivElement;
    const { columnElements, issueElements } = createColumns();
    div.append(...columnElements);

    this.dragDrop = new DragDrop(columnElements, issueElements);
  }

  onDestroy() {
    this.dragDrop.destroy();
  }

}
