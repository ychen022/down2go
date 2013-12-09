//The data structure stores all the agenda items in the agenda.
AgendaInfo = function(){

  //a list of agenda items. Each item should contain attributes id, time and place.
  var agenda_info=new Array();

  return {
    //get all the items in the agenda
    all: function() {return agenda_info;},

    //get the item with a specific index
    get: function(index) {return agenda_info[index];},

    //add a new item into the agenda
    //Item should contain attributes id, time and place
    add: function(item) {agenda_info.push(item);},

    //remove an item from the agenda list.
    remove: function(index) {agenda_info.splice(index, 1);},

    //sort all of the items in the agenda by time
    sort: function() {
      agenda_info.sort(function(a,b){
        // Get the hour numbers
        var ah = parseInt(a.time.substring(0,2));
        var bh = parseInt(b.time.substring(0,2));
        // Convert the hour numbers to a 24 hour format.
        if ((a.time.substring(6,8)==="PM") && (a.time.substring(0,2)!="12")){
          ah+=12;
        }else if((a.time.substring(6,8)==="AM") && (a.time.substring(0,2)==="12")){
          ah=0;
        }
        if ((b.time.substring(6,8)==="PM") && (b.time.substring(0,2)!="12")){
          bh+=12;
        }else if((b.time.substring(6,8)==="AM") && (b.time.substring(0,2)==="12")){
          bh=0;
        }
        return ah*60+parseInt(a.time.substring(3,5))-bh*60-parseInt(b.time.substring(3,5));
      });
    },

    //clear the agenda 
    clear: function() {agenda_info = new Array();},

    //get how many items are in the agenda.
    length: function() {return agenda_info.length;}
  };
}