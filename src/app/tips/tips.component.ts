import { Component, OnDestroy } from '@angular/core';
import { fadeInOut } from '../animations/fly-in-out.animation';
import { shuffle } from '../utils';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tips',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tips.component.html',
  styleUrl: './tips.component.scss',
  animations: [fadeInOut],
})
export class TipsComponent implements OnDestroy{
  currentTipIndex = 0;
  intervalId: any;

  constructor() {
    this.shuffleTips();
    this.intervalId = setInterval(() => {
      this.currentTipIndex = (this.currentTipIndex + 1) % this.tips.length;
    }
    , 10000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  shuffleTips() {
    this.tips = shuffle(this.tips);
  }

  tips: [string,string][] = [
    ["Did you know?", "The list of participants is automatically saved on this browser for the next time you visit."],
    ["Want to share your configuration?", "Click the 'Create Shareable Link' button at the top right of the main screen to copy a link."],
    ["Did someone join late?", "No worries! Just snooze when their name comes up, they will be moved to the end of the list."],
    ["Did someone join unexpectedly?", "Click 'Add Speaker' instead of 'Finish' and their turn will start."],
    ["Did you know?", "If you want to delete a participant, click the 'X' button."],
    ["Did you know?", "You can delete someone by hitting X, or exclude them from the current session by Unchecking their name."],
    ["Did you know?", "If you want to exclude someone without deleting them, uncheck their name before starting the session."],
    ["Did you know?", "You don't have to delete a participant if they're not speaking. Just hit the checkbox next to their name to exclude them from this session."],
    ["Who got Ralphed this session?", "Do name & shame when the scorecard is shown at the end of the session!"],
    ["Did you know?", "If you can see Ralph, you've been talking too much! Time to wrap up!"],
    ["Did your turn get interrupted?", "Hit pause to stop the timer and resume when you're ready."],
    ["Not ready for your turn?", "Hit 'Snooze' and you can join in the end of the session."],
    ["Started your turn prematurely?", "Hit 'Restart' to reset the time on your turn."],
    ["Are you seeing red?", "So is everyone else! Time is up!"],
    ["Are you seeing Orange?", "It's getting close to the end! Time to wrap up!"],
    ["Are you seeing Orange?", "It's getting close to the end! Time to wrap up!"],

    ["Did you know?", "Ralph Wiggum is the son of Chief Wiggum and Sarah Wiggum."],
    ["Ralph famously said", "'Me fail English? That's unpossible!'"],
    ["Ralph once said", "'I'm a unitard!' in gym class."],
    ["Did you know?", "Nancy Cartwright voices Ralph Wiggum."],
    ["Did you know?", "Ralph often eats paste at school."],
    ["Did you know?", "Ralph starred in the play 'The President Wore Pearls'."],
    ["Did you know?", "Ralph has a pet leprechaun that tells him to burn things."],
    ["Ralph once said", "'My cat's breath smells like cat food.'"],
    ["Did you know?", "Ralph won a diorama contest with a box of Star Wars action figures."],
    ["Did you know?", "Ralph's middle name is 'Waldo'."],
    ["Ralph once said:", "'I bent my Wookiee!'"],
    ["Did you know?", "Ralph has a pet chinchilla named Nibbles."],
    ["Did you know?", "Ralph's best friend is his own reflection."],
    ["Did you know?", "Ralph loves chocolate microscopes."],
    ["Ralph once said:", "'The doctor said I wouldn't have so many nosebleeds if I kept my finger outta there.'"],
    ["Ralph once said:", "'When I grow up, I want to be a principal or a caterpillar.'"],
    ["Did you know?", "Ralph often mistakes common objects for candy, such as a crayon he once ate."],
    ["Did you know?", "Ralph's imaginary friend is Wiggle Puppy."]
  ];


}
