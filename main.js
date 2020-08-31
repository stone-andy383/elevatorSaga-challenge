{
  /*
 * Elevator Saga code challenge
 * https://play.elevatorsaga.com/
 */
  
  init: function(elevators, floors) {

    // Create loop to go through every floor and create a event listener for button pushes
    for (let i = 0; i < floors.length; i++) {
      let floor = floors[i];
        
      // Add floor to queue if up button is pressed
      floor.on("up_button_pressed", function(floor) {
        let elevatorIdle = [];
        let elevatorInPath = [];
        let elevatorLeastUsed = 0;
        let elevatorLeastUsedCapacity = null;
        
        // Cycle through all elevators to determine which one to send
        for (let i = 0; i < elevators.length; i++) {
          let elevator = elevators[i];
          
          // Find elevators that are empty and idle
          if (elevator.loadFactor() === 0 && elevator.destinationDirection() === 'stopped') {
            elevatorIdle.push(i);
          }
          
          // Find elevators that are below the pushed floor and going up
          if (elevator.currentFloor() < floor.floorNum() && elevator.goingUpIndicator()) {
            elevatorInPath.push(i);
          }

          // Find elevator with smallest queue
          if (elevator.destinationQueue.length < elevatorLeastUsedCapacity || elevatorLeastUsedCapacity === null) {
            elevatorLeastUsed = i;
            elevatorLeastUsedCapacity = elevator.destinationQueue.length;
          }
        }
        
        // Make choice on which elevator to send to this floor
        if (elevatorIdle.length > 0) {
          elevators[elevatorIdle[0]].goToFloor(floor.floorNum());
        } else if (elevatorInPath.length > 0) {
          elevators[elevatorInPath[0]].goToFloor(floor.floorNum());
        } else {
          elevators[elevatorLeastUsed].goToFloor(floor.floorNum());
        }
        
      });
        
      // Add floor to queue if down button is pressed
      floor.on("down_button_pressed", function(floor) {
        let elevatorIdle = [];
        let elevatorInPath = [];
        let elevatorLeastUsed = 0;
        let elevatorLeastUsedCapacity = null;

        // Cycle through all elevators to determine which one to send
        for (let i = 0; i < elevators.length; i++) {
          let elevator = elevators[i];

          // Find elevators that are empty and idle
          if (elevator.loadFactor() === 0 && elevator.destinationDirection() === 'stopped') {
            elevatorIdle.push(i);
          }

          // Find elevators that are above the pushed floor and going down
          if (elevator.currentFloor() > floor.floorNum() && elevator.goingDownIndicator()) {
            elevatorInPath.push(i);
          }

          // Find elevator with smallest queue
          if (elevator.destinationQueue.length < elevatorLeastUsedCapacity || elevatorLeastUsedCapacity === null) {
            elevatorLeastUsed = i;
            elevatorLeastUsedCapacity = elevator.destinationQueue.length;
          }
        }

        // Make choice on which elevator to send to this floor
        if (elevatorIdle.length > 0) {
          elevators[elevatorIdle[0]].goToFloor(floor.floorNum());
        } else if (elevatorInPath.length > 0) {
          elevators[elevatorInPath[0]].goToFloor(floor.floorNum());
        } else {
          elevators[elevatorLeastUsed].goToFloor(floor.floorNum());
        }
      });
    }
    
    // Elevator variables
    for (let i = 0; i < elevators.length; i++) {
      let elevator = elevators[i];
      
      // Whenever the elevator is idle (has no more queued destinations) ...
      elevator.on("idle", function() {

      });

      // Add floor event listener to add floor to queue when guest presses a button
      elevator.on("floor_button_pressed", function(floorNum) {
        // Check if queue is empy and just add it
        if (elevator.destinationQueue.length === 0) {
          elevator.goToFloor(floorNum);
        } else if (elevator.destinationQueue.includes(floorNum, 0)) {
          // Do nothing, already going to stop
        } else {
          elevator.goToFloor(floorNum);
          //Initially look to smartly add floor to queue in order
          /*  
          //Cycle through elevator queue to determine where to place stop
          for (let i = 0; i < elevator.destinationQueue.length; i++) {
            // Add destination in acending order if elevator is going up
            if(elevator.goingUpIndicator() && !elevator.goingDownIndicator()){
              if (floorNum < elevator.destinationQueue[i]) {
                console.log("array before" + elevator.destinationQueue);
                elevator.destinationQueue.splice(i, 0, floorNum);
                elevator.checkDestinationQueue();
                console.log("array after" + elevator.destinationQueue);
                //break;
              }
              // Add destination in descending order if elevator is going down
            } else if (elevator.goingDownIndicator() && !elevator.goingUpIndicator()){
              if (floorNum > elevator.destinationQueue[i]) {
                console.log("array before" + elevator.destinationQueue);
                elevator.destinationQueue.splice(i, 0, floorNum);
                elevator.checkDestinationQueue();
                console.log("array after" + elevator.destinationQueue);
                //break;
              }
            } else {
              elevator.goToFloor(floorNum);
              //break;
            }*/
        }
      });

      // Add event listener for when the elevator is stopped at a floor
      elevator.on("stopped_at_floor", function(floorNum) {
        // Remove all additional calls to this floor from queue
        if (elevator.destinationQueue.includes(floorNum, 0) && (floors[floorNum].buttonStates.up != 'activated') && (floors[floorNum].buttonStates.down != 'activated')) {
            for(let i = 0; i < elevator.destinationQueue.length; i++) {
                if (elevator.destinationQueue[i] === floorNum) {
                    elevator.destinationQueue.splice(i, 1);
                }
            }
            elevator.checkDestinationQueue();
        }
        
        // Let's set the elevator's direction so we know which way it's going               
        if (elevator.destinationQueue[0] < floorNum) {
            elevator.goingDownIndicator(true);
            elevator.goingUpIndicator(false);
        } else if (elevator.destinationQueue[0] > floorNum){
            elevator.goingDownIndicator(false);
            elevator.goingUpIndicator(true);
        } else if (floorNum == 0) {
          elevator.goingDownIndicator(false);
            elevator.goingUpIndicator(true);
        } else if (floorNum == floors.length) {
          elevator.goingDownIndicator(true);
            elevator.goingUpIndicator(false);
        }
        else {
            elevator.goingUpIndicator(true);
            elevator.goingDownIndicator(true);
        }
      });
        
      elevator.on("passing_floor", function(floorNum, direction) {
        // if guest waiting on next floor and heading in same direction, update queue to stop there
        if (direction === 'up' && floors[floorNum].buttonStates.up === 'activated' && elevator.loadFactor() < 1) {
          // Remove original queue number from the queue
          let indexToRemove = elevator.destinationQueue.indexOf(floorNum);
          if (indexToRemove != -1) {
            elevator.destinationQueue.splice(indexToRemove, 1);
          }
          // Add floor to beginning of queue
          elevator.destinationQueue.splice(0, 0, floorNum);
          elevator.checkDestinationQueue();
        } else if (direction === 'down' && floors[floorNum].buttonStates.down === 'activated' && elevator.loadFactor() < 1) {
          // Remove original queue number from the queue
          let indexToRemove = elevator.destinationQueue.indexOf(floorNum);
          if (indexToRemove != -1) {
            elevator.destinationQueue.splice(indexToRemove, 1);
          }

          // Add floor to beginning of queue
          elevator.destinationQueue.splice(0, 0, floorNum);
          elevator.checkDestinationQueue();
        }

        // Check if the upcoming floor is in queue and stop early to drop off guest
        if (elevator.getPressedFloors().includes(floorNum, 0) && elevator.destinationQueue[0] != floorNum) {
          // Remove original queue number from the queue
          let indexToRemove = elevator.destinationQueue.indexOf(floorNum);
          if (indexToRemove != -1) {
            elevator.destinationQueue.splice(indexToRemove, 1);
          }
          
          // Add floor to beginning of queue
          elevator.destinationQueue.splice(0, 0, floorNum);
          elevator.checkDestinationQueue();
        }
      });
    }
  },
      update: function(dt, elevators, floors) {
          // We normally don't need to do anything here
      
          /*  Monitor destination queue
          let temp = "Queue: ";
          for(let i = 0; i < elevators[0].destinationQueue.length; i++) {
            temp = temp + elevators[0].destinationQueue[i] + ',';
          }
          console.log(temp);
          */
      }
}