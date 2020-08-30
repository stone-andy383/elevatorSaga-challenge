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

      // add floor event lisenter to add floor to queue when guest presses a button
      elevator.on("floor_button_pressed", function(floorNum) {
          elevator.goToFloor(floorNum)
      });
  },
      update: function(dt, elevators, floors) {
          // We normally don't need to do anything here
      }
}