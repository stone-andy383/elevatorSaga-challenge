{
  /*
 * Elevator Saga code challenge
 * https://play.elevatorsaga.com/
 */
  
  init: function(elevators, floors) {
      // Elevator variable
      var elevator = elevators[0];
      
      // Create loop to go through every floor and create a event listener for button pushes
      for (i = 0; i < floors.length; i++) {
          let floor = floors[i];
          
          // Add floor to queue if up button is pressed
          floor.on("up_button_pressed", function(floor) {
              elevator.goToFloor(floor.floorNum());
          });
          
          // Add floor to queue if down button is pressed
          floor.on("down_button_pressed", function(floor) {
              elevator.goToFloor(floor.floorNum());
          });
      }

      // Whenever the elevator is idle (has no more queued destinations) ...
      elevator.on("idle", function() {

      });

      // Add floor event lisenter to add floor to queue when guest presses a button
      elevator.on("floor_button_pressed", function(floorNum) {
          elevator.goToFloor(floorNum)
      });
      
      // Add event listener for when the elevator is stopped at a floor
      elevator.on("stopped_at_floor", function(floorNum) {
          // Grab load factor from elevator
          let elevatorEmpty = elevator.loadFactor();
          
          // Check if elevator is full. If it's not full, remove all additional calls to this floor from queue
          // If last person entered made elevator full, this will leave an extra call to the floor still
          if (elevatorEmpty < 1) {
              for(let i = 0; i < elevator.destinationQueue.length; i++) {
                  if (elevator.destinationQueue[i] === floorNum) {
                      elevator.destinationQueue.splice(i, 1);
                  }
              }
              // Update queue once floors removed
              elevator.checkDestinationQueue();
          }
      })
  },
      update: function(dt, elevators, floors) {
          // We normally don't need to do anything here
      }
}