


/* url of song api --- https versions hopefully a little later this semester */	
const api = 'https://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php';

console.log('this is secure');



addEventListener("DOMContentLoaded", async (event) =>{


   const selectBars = Array.from(document.querySelectorAll(".select"));
   var music = await localStorage.getItem("data");
   const artists = await fetchData("./starting-files/artists.json");
   const genres = await fetchData("./starting-files/genres.json");
   const pages = Array.from(document.querySelector("main").children);
   const topLists = Array.from(document.querySelectorAll('.mainList'));
   const radioBtns = Array.from(document.querySelectorAll('input[type="radio"]'));
   const listButtons = document.querySelector("#listSongs");
   const tables = document.querySelectorAll('table');
   const tableHeads= document.querySelectorAll('thead');
   var playlist = localStorage.getItem('playlist');
   const sortingFunctions = {
      'year' : function (a,b) {return b.year - a.year},
      'genre' :  function (a,b){return a.genre.name.localeCompare(b.genre.name)},
      'artist' : function(a,b) {return a.artist.name.localeCompare(b.artist.name)},  
      'title' :  function (a,b) { return a.title.localeCompare(b.title)}
   }

   var currentFilter;
   var selectedSort;

   


   await main();



   async function main(){
      await init();
      await makeListeners();
      await makeTables();

      
   }

   async function init(){

      if(playlist ===null){
         playlist = [];
      }
      else{
         playlist = JSON.parse(playlist);
      }
      if(music ===null){
         music = await fetchData(api);
         localStorage.setItem("data", JSON.stringify(music));
         selectedSort=music;
      }
      else {
         music = JSON.parse(music);
         selectedSort = music;
      }
   }

   async function makeListeners(){
      document.querySelector("#clear").addEventListener("click", (event) =>clear(event));
      listButtons.addEventListener("click", (event) => filterSearch(event));
      radioBtns.forEach((radio) => radio.addEventListener("change", (event)=>radioListener(event)));
      tables.forEach((table)=>  table.addEventListener('click', (event)=>tableListener(event)));
      document.querySelector("#homeButtons").addEventListener("click", (event) => pageSwitch(event)); 
      tableHeads.forEach((th) => {th.addEventListener('click', (event) => rearrangeTable(event))})
      topLists.forEach((list) => {list.addEventListener('click', (event)  => redirect(event.target))})

   }

   async function fetchData(URL) {
      var response = await fetch(URL).then(response => response.json());
      return response;
  }


  async function populateSelect(populator, select){

   for(item of populator){
      let option = document.createElement('option');
      option.innerHTML=item.name;
      option.value=item.id;

      select.appendChild(option);
   }
  }

  function redirect(target){
      var selectRadio= document.querySelector(`#${target.dataset.type}Rad`); 
      if(target.dataset.type =='artist' || target.dataset.type =='genre'){
         document.querySelector('#browse').click();
         selectRadio.click();
         currentFilter.value= target.dataset.id;
         document.querySelector('#listSongs').click();

      }
  }

  function popupText(text){
      let popup = document.querySelector('#popupElement')

      popup.textContent=text;
      popup.style.display = "block";
      setTimeout(() => {
         popup.style.display = "none";
      }, 5000);

  };

   async function makeTables(){
      const topGenres = findFreq('genre');
      const topArtists = findFreq('artist');
      const popularitySort= music.toSorted((a,b) => {return b.details.popularity - a.details.popularity;})
      await populateTable(document.querySelector('#playlistTable'), playlist);
      await populateTable(document.querySelector('#searchList'), selectedSort);
      await populateTopTable(document.querySelector('#topArtists'), topArtists);
      await populateTopTable(document.querySelector('#topGenres'), topGenres);
      await populateTopTable(document.querySelector('#topSongs'), popularitySort);
      await populateSelect(genres ,document.querySelector('#genre'));
      await populateSelect(artists ,document.querySelector('#artist'));
   }
  

  function clear(event){
      event.stopPropagation();
         resetBoxes(selectBars);
         selectedSort=music;
         populateTable(document.querySelector('#searchList'), music);
   }
   
  function radioListener(event){
   if(event.target.type==="radio"){
      resetBoxes(selectBars);
      currentFilter = document.querySelector(`#${event.target.dataset.id}`);

      console.log(`${event.target.dataset.id}`);
      currentFilter.disabled = false;
   }      
};
   
   function pageSwitch(event){

      pages.forEach(function(page) {

         if(event.target.classList.contains("header-div")){
         if (((page.dataset.id === event.target.id)&& (page.classList.contains("hide"))) ||
         
         
         (page.dataset.id != event.target.id)&& (!page.classList.contains("hide"))) {
            page.classList.toggle("hide");
         }}
   });

}

   function filterSearch(){
      event.stopPropagation();
      if(currentFilter!=null){
         let searchedValue = currentFilter.id;
         if(currentFilter.value===''){
            alert('Please choose an option.')
         }
         else{
         populateTable(document.querySelector('#searchList'), selectedSort.filter((song) => checkFilter(currentFilter.value, song[searchedValue])));
      }  
      }
      else{
         alert('Please choose a search option.');
      }
   }

   function checkFilter(value, filter) {
      if(typeof filter ==='object'){

         filter = filter['id'];
         return filter==value;
      }

      return filter.toLowerCase().includes(value.toLowerCase());
    }
   
   async function populateTable(table, list){
      table.innerHTML="";

      for(song of list){
         var newRow = makeRow(table, song);
         table.appendChild(newRow);
      }
   }

  function makeRow(table, song){
      var type= '';
      if(table.id ==="searchList"){
         type = 'class= "addPlaylist playlist">Add';
      }
      else if(table.id==="playlistTable"){
         type = 'class= "removePlaylist">Remove';
      }
      var newRow = document.createElement("tr");
      var shortenedTitle= song.title.substring(0,24);
      if(song.title.length>25){
         shortenedTitle = shortenedTitle.substring(0, 23);
         shortenedTitle += `<button type='button' class="titleEllipse" data-id = "${song.song_id}">`+ '&hellip;'+ '</button>';
      }
      newRow.dataset.id = song.song_id;
      newRow.innerHTML = `<td data-type = "title" data-id="${song.title}">${shortenedTitle}</td><td data-type = "artist" data-id= 
      "${song.artist.name}">${song.artist.name}</td><td data-type = "genre" data-id="${song.genre.name}">${song.genre.name}
      </td><td data-type = "year" data-id = "${song.year}">${song.year}</td><td data-type = "button" ><button  type= 'button'
       data-id = '${song.song_id}' ${type} </button></td>`;
      return newRow;
   }


   
   function tableListener (event){
         const target = event.target;
         const thisSong = findSong(music, target);
         
         if(event.target.classList.contains('titleEllipse')){showName(song);}
         if(target.classList.contains("addPlaylist")){
            if(typeof (findSong(playlist, target)) !== 'undefined'){
               alert('This song is already in the playlist');}
            else{
               playlist.push(thisSong);
            }
         }
         else if(event.target.classList.contains('removePlaylist')){laylist = removeSong(thisSong);}
         else if(event.target.classList.contains('clearPlaylist')){playlist = [];}
         updatePlaylist();
   }

   function updatePlaylist(){
      localStorage.setItem('playlist', JSON.stringify(playlist));
      populateTable(document.querySelector('#playlistTable'), playlist);

   }

   function removeSong(thisSong){
     return playlist.filter((song)=>{
         return !(thisSong.song_id == song.song_id);
      });
   }

   function showName(song){
      popupText(`${song.title}`);
   }

   function findSong(list, item){

      return list.find((song)=>{

         return song.song_id == item.dataset.id
      })
   }

   function rearrangeTable(event){
      if(event.target.classList.contains('rearrange')){
         var tbody = document.querySelector(`#${event.target.dataset.table}`);
         var criteria = event.target.dataset.id;
         if(tbody.id =='searchList'){
            rearrangeSearchTable(criteria, tbody, event.target, selectedSort);
         }
         else if(tbody.id =='playlistTable'){
            rearrangeSearchTable(criteria, tbody, event.target, playlist);

         }
      }
   }
   
   function rearrangeSearchTable(criteria, tbody, header, list){
      var checkSelected = header.classList.contains('selected');
      var currentSongs=list.sort(sortingFunctions[`${criteria}`]);;
      if(currentFilter!=null && currentFilter.value !='' && tbody.id =="searchList"){
            currentSongs= list.filter((song) => checkFilter(currentFilter.value, song[currentFilter.id]));
      }
      if(checkSelected && !(header.firstChild.classList.contains('rotated'))){
         currentSongs = currentSongs.reverse();
         header.firstChild.classList.toggle('rotated');
      }
      else{
         resetSorts(header.parentElement);
         header.classList.add('selected');
      }
      populateTable(tbody, currentSongs);   
   }


   function resetSorts(tableHead){
      for(var colHead of tableHead.children){
         console.log('working');
         console.log(colHead.dataset.id);
         console.log(colHead.dataset.table);
         colHead.classList.remove("selected");
         console.log(colHead.classList);
         colHead.firstChild.classList.remove('rotated');


      }
   };
      
   function resetBoxes(resetted){
      resetted.forEach(function(option)
      {
         option.disabled = true;
         currentFilter =null; 
      })   
   }

   function populateTopTable(table, list){
      table.innerHTML="";
      for(let i = 0; i < 15; i++){
         var newRow = document.createElement("li");
         if(typeof list[i]==='object'){
            newRow.innerHTML = list[i]['title'];
            newRow.dataset.id = list[i]['title'];
            newRow.dataset.type = 'title';
         }
         else{
            let splitWord = list[i].split('|')
            newRow.innerHTML = splitWord[0];
            newRow.dataset.id = splitWord[1]; 
            newRow.dataset.type = splitWord[2];
         }
        table.appendChild(newRow);
     }
   }   

  function findFreq(discriminator) {
      let freqs = {};
      for (let song of music) {
         let songString = `${song[discriminator]['name']}|${song[discriminator]['id']}|${discriminator}` 
         if (freqs[songString] === undefined) { 
            freqs[songString] = 1; 
         } 
         else {
            freqs[songString] += 1;
         }
      }
      let frequencyArray = [];
      for (key in freqs) {frequencyArray.push([freqs[key], key]);}
      frequencyArray.sort((a, b) => {return b[0] - a[0];});
     mostFreq = [];
     for (let i = 0; i < 15; i++) {mostFreq.push(frequencyArray[i][1]);}
     return mostFreq;
   }





   /**
    * 
    * Place code below
    * 
    * 
    * 
    */









   });

 
   

   





 

/* note: you may get a CORS error if you try fetching this locally (i.e., directly from a
   local file). To work correctly, this needs to be tested on a local web server.  
   Some possibilities: if using Visual Code, use Live Server extension; if Brackets,
   use built-in Live Preview.
*/
