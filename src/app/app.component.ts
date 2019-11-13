import { Component, OnInit } from "@angular/core";
import { Model } from "./model";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  modelsArray: Model[] = [];
  currentView: Model[] = [];
  description = "";
  hour: number;
  hashtag = "";
  activities = "";
  date: Date;
  display = false;                          //for add task modal
  displayGroup = false;                     //for toggle of group view modal
  data: any;                                //for data representation inside the doughnut
  KEY: "time-tracking";                     //for localStorage

  ngOnInit() {
    this.date = new Date();                 //set the date to date today so that it will initially show the tasks for today
    const modelsArray = JSON.parse(localStorage.getItem(this.KEY)); //get the items from the local storage

    if (modelsArray != null) this.modelsArray = modelsArray;        //store to modelsArray (compilation of models)
    this.viewByDate();                      //initially shows the task for today
  }

  showDialog() {
    this.display = true;
  }

  showGroupDialog() {
    this.displayGroup = true;
  }

  add() {                                    //add new task
    if (
      this.description != null &&            //the inputs must be filled before pushing the model into the modelsArray
      this.description != "" &&
      this.hour > 0 &&                       
      this.hour < 24 &&
      this.hashtag != null &&
      this.hashtag != "" &&
      this.activities != null &&
      this.date != null
    ) {
      const model = new Model(
        this.description,
        this.hour,
        this.hashtag,
        [...this.activities.split(",")],
        this.date.toLocaleDateString()
      );
      this.modelsArray.push(model);
      this.viewByDate();                    //to update the list of tasks from the date picker
      localStorage.setItem(this.KEY, JSON.stringify(this.modelsArray));   //store to localStorage the updated modelsArray 
    }
  }

  delete(idx: number) {                     //delete the chosen task
    let currentView = this.modelsArray.filter(                          //store models present in the current view
      obj => obj.date == this.date.toLocaleDateString()
    );

    const notInView = this.modelsArray.filter(                          //store models that are not present in the current view
      obj => obj.date !== this.date.toLocaleDateString()
    );

    currentView = currentView.filter((obj, i) => i !== idx);            //remove the model with index == idx from the current view

    this.modelsArray = [...notInView, ...currentView];                  //merge the arrays into one again
    localStorage.setItem(this.KEY, JSON.stringify(this.modelsArray));   //store to localStorage the updated modelsArray
    this.viewByDate();
  }

  viewByDate() {                            //filter modelsArray using the current date
    this.currentView = this.modelsArray.filter(obj => {
      return obj.date == this.date.toLocaleDateString();
    });
    this.donut();
  }

  donut() {                                 //visualize tasks by hashtag for each day
    let labelsArray: string[] = [];
    this.currentView.forEach((obj) => {
      if (!labelsArray.includes(obj.hashtag)) {
        labelsArray.push(obj.hashtag);
      }
    });
    const colorsArray = labelsArray.map(() => this.createColor());

    this.data = {
      labels: labelsArray,
      datasets: [
        {
          data: labelsArray.map(label => {
            return this.currentView.reduce((acc,curr) => {
              if (curr.hashtag === label) return acc + curr.hour;
              return acc;
            }, 0)
          }),
          backgroundColor: colorsArray,
          hoverBackgroundColor: colorsArray
        }
      ]
    };
  }

  createColor(): string {                   //generates random pastel color
    return `hsl(${360 * Math.random()}, ${25 + 70 * Math.random()}%, ${85 + 10 * Math.random()}%)`;
  }
}
