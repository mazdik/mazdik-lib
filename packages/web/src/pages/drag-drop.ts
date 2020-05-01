import html from './drag-drop.html';
import { Droppable, DragElementEvent, DropElementEvent } from '@mazdik-lib/drag-drop';
import { arrayMove, arrayTransfer } from '@mazdik-lib/common';

class Item {
  name: string;
  text: string;
}

export default html;

export function page() {

  const items: Item[][] = [
    [
      {name: 'Task 1', text: 'Write a program that prints ‘Hello World’ to the screen'},
      {name: 'Task 2', text: 'Write a program that asks the user for their name and greets them with their name'},
      {name: 'Task 3', text: 'Modify the previous program such that only the users Alice and Bob are greeted with their names'},
    ],
    [
      {name: 'Task 4', text: 'Write a program that asks the user for a number n and prints the sum of the numbers 1 to n'},
      {name: 'Task 5', text: 'Modify the previous program such that only multiples of three or five are considered in the sum'},
      {name: 'Task 6', text: 'Write a program that prints a multiplication table for numbers up to 12'},
    ],
    [
      {name: 'Task 7', text: 'Write a function that returns the largest element in a list'},
      {name: 'Task 8', text: 'Write function that reverses a list, preferably in place'},
      {name: 'Task 9', text: 'Write a function that checks whether an element occurs in a list'},
    ],
    [
      {name: 'Task 10', text: 'Write a function that returns the elements on odd positions in a list'},
      {name: 'Task 11', text: 'Write a function that computes the running total of a list'},
      {name: 'Task 12', text: 'Write a function that tests whether a string is a palindrome'},
    ],
    [
      {name: 'Task 13', text: 'Write a program that prints all prime numbers'},
      {name: 'Task 14', text: 'Write a guessing game where the user has to guess a secret number'},
      {name: 'Task 15', text: 'Write a program that prints the next 20 leap years'},
    ]
  ];
  let source: Item[];
  const droppables: Droppable[] = [];

  function onDragStart(event: DragEvent, index: number, src: Item[]) {
    event.dataTransfer.setData('text', index.toString());
    event.dataTransfer.effectAllowed = 'move';
    const dragElementEvent: DragElementEvent = { event, index };
    droppables.forEach(x => x.dragElementEvent = dragElementEvent);
    source = src;
  }

  function onDrop(event: DropElementEvent, target: Item[]) {
    if (event.type === 'reorder') {
      arrayMove(target, event.previousIndex, event.currentIndex);
    } else {
      arrayTransfer(source, target, event.previousIndex, event.currentIndex);
    }
  }

  function createIssues(issues: Item[]): HTMLDivElement[] {
    const elements = [];

    issues.forEach((option, i) => {
      const issue = document.createElement('div');
      issue.className = 'dd-issue';
      issue.draggable = true;
      issue.addEventListener('dragstart', (event) => {
        onDragStart(event, i, issues);
      });

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

  function createColumns(): HTMLDivElement[] {
    const elements = [];

    items.forEach(item => {
      const column = document.createElement('div');
      column.className = 'dd-column';
      column.append(...createIssues(item));
      droppables.push(new Droppable(column));
      column.addEventListener('dropElement', (event: CustomEvent<DropElementEvent>) => {
        onDrop(event.detail, item);
      });

      elements.push(column);
    });

    return elements;
  }

  const div = document.querySelector('#drag-drop-demo') as HTMLDivElement;
  div.append(...createColumns());

}
