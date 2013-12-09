AgendaInfo = function(){
  var agenda_info=new Array();
  return {
    all: function() {return agenda_info;},
    get: function(index) {return agenda_info[index];},
    add: function(item) {agenda_info.push(item);},
    remove: function(index) {agenda_info.splice(index, 1);},
    sort: function() {
      agenda_info.sort(function(a,b){
        var ah = parseInt(a.time.substring(0,2));
        var bh = parseInt(b.time.substring(0,2));
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
        //var dateA=new Date(a.time);
        //var dateB=new Date(b.time);
        //return dateA-dateB;
      });
    },
    clear: function() {agenda_info = new Array();},
    length: function() {return agenda_info.length;}
  };
}