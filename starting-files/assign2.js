/* url of song api --- https versions hopefully a little later this semester */	
const api = 'https://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php';

addEventListener("DOMContentLoaded", async (event) =>{


   const selectBars = Array.from(document.querySelectorAll(".select"));
   const artists = await fetchData("./starting-files/artists.json");
   const genres = await fetchData("./starting-files/genres.json");
   const pages = Array.from(document.querySelector("main").children);
   const topLists = Array.from(document.querySelectorAll('.mainList'));
   const radioBtns = Array.from(document.querySelectorAll('input[type="radio"]'));
   const listButtons = document.querySelector("#listSongs");
   const tables = document.querySelectorAll('.songDisplay');
   const tableHeads= document.querySelectorAll('.listHead');
   const sortingFunctions = { //All the different types of sorts contained in a
      'year' : function (a,b) {return b.year - a.year},
      'genre' :  function (a,b){return a.genre.name.localeCompare(b.genre.name)},
      'artist' : function(a,b) {return a.artist.name.localeCompare(b.artist.name)},  
      'title' :  function (a,b) { return a.title.localeCompare(b.title)}
   }

   const songViewers = document.querySelectorAll('.songViewer');

   let music = await localStorage.getItem("data");
   let playlist = localStorage.getItem('playlist');
   let currentFilter;   // The current filter that is in the browsing table. So that only present song is being ordered
   let selectedSort; //The kind of sort that the searching table is currently in. Holds the music as a copy in order to not affect the base array of music when it is being sorted and such
   let currentPlaylistSort; // Holds the way the playlist is being sorted. This is so that I can add new songs in the proper order.

   main();//Begins the program

   /**
    * 
    * 
    * runs the programs and initial functions
    */ 
   async function main(){
      await init();
      await makeListeners();
      await makeTables();}
   /**
    * 
    * Initializes the required data, searches for what is already in local storage
    */

   async function init(){

      if(playlist ===null){
         playlist = [];}
      else{
         playlist = JSON.parse(playlist);}
      if(music ===null){
         console.log('Getting from API');
         try {
         music = await fetchData(api);
         localStorage.setItem("data", JSON.stringify(music));
         selectedSort=structuredClone(music);}
         catch(error){
            alert('File not Found. Please Refresh the Page');

         }
      }
      else {
         console.log('Getting from stored Data');
         music = JSON.parse(music);
         selectedSort = structuredClone(music);}
      }
      

   /**
    * 
    * Makes all my listeners.
    */

   async function makeListeners(){
      document.querySelector("#clear").addEventListener("click", (event) =>clear(event));
      listButtons.addEventListener("click", (event) => filterSearch(event));
      radioBtns.forEach((radio) => radio.addEventListener("change", (event)=>radioListener(event)));
      tables.forEach((table)=>  table.addEventListener('click', (event)=>tableListener(event)));
      document.querySelector("#homeButtons").addEventListener("click", (event) => pageSwitch(event)); 
      tableHeads.forEach((th) => {th.addEventListener('click', (event) => rearrangeTable(event.target))})
      topLists.forEach((list) => {list.addEventListener('click', (event)  => redirect(event.target))})
      songViewers.forEach((songViewer) => {songViewer.addEventListener('click', (event) => makeSongView(event.target))});
      document.querySelector("#credits").addEventListener('mouseover', () => {
         document.querySelector("#creditContents").classList.remove("creditPopup");
         setTimeout(() => {document.querySelector("#creditContents").classList.add("creditPopup");}, 3600);});}

   /**
    * 
    * @param {} URL the JSON url
    * @returns a file in JSON
    * 
    * This function returns me a JSON file from a URL
    */

   async function fetchData(URL) {
      let response = await fetch(URL).then(response => response.json());
      return response;}

  /**
   * 
   * @param {} populator The Array for the genre/artist
   * @param {} select The select bar that is to be populated
   * 
   * This bar populates the select bars with the data from the JSON files provided.
   */

  async function populateSelect(populator, select){

   for(item of populator){
      let option = document.createElement('option');
      option.innerHTML=item.name;
      option.value=item.id;
      select.appendChild(option);}}

  /**
   * 
   * @param {} target This is the song link that was clicked.
   * This function redirects users to a different page.
   */

  function redirect(target){
      let selectRadio= document.querySelector(`#${target.dataset.type}Rad`); 
      if(target.dataset.type =='artist' || target.dataset.type =='genre'){
         document.querySelector('#browse').click();
         selectRadio.click();
         currentFilter.value= target.dataset.id;
         document.querySelector('#listSongs').click();}}
  /**
   * 
   * @param {} text The text to appear
   * 
   * This function makes popups/snackbars appear and sets their message.
   */

  function popupText(text){
      let popup = document.querySelector('#popupElement')
      popup.textContent= text;
      popup.style.display = "block";
      setTimeout(() => {
         popup.style.display = "none";
      }, 6000);};
  /**
   * 
   * THis function populates the tables and calls the functions populating each one, as well as finding the top genres and artists for the "Top" tables
   * 
   */
   async function makeTables(){
      const topGenres = findFreq('genre');
      const topArtists = findFreq('artist');
      const popularitySort= music.toSorted((a,b) => {return b.details.popularity - a.details.popularity;})
      await populateTable(document.querySelector('#playlistTable'), playlist);
      await populateTable(document.querySelector('#searchList'), music);
      await populateTopTable(document.querySelector('#topArtists'), topArtists);
      await populateTopTable(document.querySelector('#topGenres'), topGenres);
      await populateTopTable(document.querySelector('#topSongs'), popularitySort);
      await populateSelect(genres ,document.querySelector('#genre'));
      await populateSelect(artists ,document.querySelector('#artist'));}
   /**
    * 
    * @param {} event The click of the "clear" button
    * 
    * This function clears the search results and the select bars, as well as the header
    */
  function clear(event){
      event.stopPropagation();
         resetBoxes(selectBars);
         selectedSort=structuredClone(music);
         resetSorts(Array.from(document.querySelectorAll(`.searchListHead`)));
         populateTable(document.querySelector('#searchList'), selectedSort);
   }

/**
 * 
 * @param {*} target Contains either song.title or song.song_id for song of interest
 * 
 * Identifies and specifies data of a clicked songLink, then feeds the "song" object to singleSongViewer(thisSong)
 */

   function makeSongView(target){
      if(target.classList.contains('songLink')){
         document.querySelector('#singleSongViewer').click();
         console.log('did the thing');
         const thisSong = findSong(music, target);
         singleSongViewer(thisSong);
      }
   }
   
   /**
    * 
    * @param {} event The change of the radio button
    * 
    * This listener connects to each radio button, when it changes, it activates the connected search bar.
    */

  function radioListener(event){
   if(event.target.type==="radio"){
      resetBoxes(selectBars);
      currentFilter = document.querySelector(`#${event.target.dataset.id}`);
      console.log(`${event.target.dataset.id}`);
      currentFilter.disabled = false;
   }      
};

/**
 * 
 * @param {} event the click or simulated click
 * 
 * This function switches page views.
 */
   
   function pageSwitch(event){

      pages.forEach(function(page) {
         if(event.target.classList.contains("header-div")){
         if (((page.dataset.id === event.target.id)&& (page.classList.contains("hide"))) ||(page.dataset.id != event.target.id)&& (!page.classList.contains("hide"))) {
            page.classList.toggle("hide");}}
   });

}

/**
 * 
 * This activates the search protocols, checking to see if the user has actually inputted anything
 */

   function filterSearch(){
      event.stopPropagation();
      if(currentFilter!=null){
         let searchedValue = currentFilter.id;
         if(currentFilter.value===''){
            alert('Please choose an option.')}
         else{
            let filtered = selectedSort.filter((song) => checkFilter(currentFilter.value, song[searchedValue]));

            populateTable(document.querySelector('#searchList'), filtered);}  
      }
      else{
         alert('Please choose a search option.');}}

   /**
    * 
    * @param {*} value the value of the search
    * @param {*} filter the filtering property of the song
    * 
    * This function checks to see if a song meets certain criteria for the search
    */

   function checkFilter(value, filter) {
      if(typeof filter ==='object'){
         filter = filter['id'];
         return filter==value;
      }
      return filter.toLowerCase().includes(value.toLowerCase());
    }

    /**
     * 
     * @param {
     * } table The table to be populated
     * @param {*} list the list we're populating the table with
     * 
     * This function populates the tables in the playlist and browse tabs
     */
   
   async function populateTable(table, list){
      table.innerHTML="";

      for(song of list){
         let newRow = makeRow(table, song);
         table.appendChild(newRow);
      }
   }

   /**
    * 
    * @param {*} table the table to add it to. (Checks what button type to add)
    * @param {*} song The song that a row is being made for.
    * @returns the row to be added
    * 
    * 
    */

  function makeRow(table, song){
      let buttonType= ["addPlaylist", "Add"] ;
      if(table.id==="playlistTable"){
         buttonType = ["removePlaylist", "Remove"];}
      let newRow = document.createElement("li");
      let shortenedTitle= song.title.substring(0,23);
      if(song.title.length>25){
         shortenedTitle += `<button type='button' class="titleEllipse" data-id = "${song.song_id}">`+ '&hellip;'+ '</button>';}
      let order = [shortenedTitle, song.artist.name, song.genre.name, song.year];
      newRow.dataset.id = song.song_id;
      fillRow(song, order, newRow, buttonType);
      return newRow;
   }

   /**
    * 
    * @param {} song the song we are using
    * @param {*} order The elements to be filled in each part
    * @param {*} row the row to add to
    * @param {*} buttonType the list holding the button types.
    */

   function fillRow(song, order, row , buttonType){
      for(item of order){
         let div = document.createElement('div');
         div.innerHTML=item;
         row.appendChild(div);}
      row.firstChild.dataset.id = song.title;
      row.firstChild.classList.add("link", "songLink");
      let button =document.createElement("button");
      let buttonDiv = document.createElement('div');
      button.innerText = buttonType[1];
      button.type = "button";
      button.dataset.id = song.song_id;
      button.classList.add(`${buttonType[0]}`);
      buttonDiv.appendChild(button);
      row.appendChild(buttonDiv);};

   /**
    * 
    * @param {} event 
    * 
    * This listens the table body, handling each button through event delegation. 
    * Handles the buttons for ellipses, and for removing/adding/clearing the playlist.
    */
   
   function tableListener (event){
         const target = event.target;
         const thisSong = findSong(music, target);
         
         if(event.target.classList.contains('titleEllipse')){showName(thisSong);}
         if(target.classList.contains("addPlaylist")){
            if(typeof (findSong(playlist, target)) !== 'undefined'){
               alert('This song is already in the playlist');}
            else{
               playlist.push(thisSong);
               popupText(`${thisSong.title} Added to Playlist`)}}
         else if(event.target.classList.contains('removePlaylist')){removePlaylistSong(thisSong);}
         else if(event.target.classList.contains('clearPlaylist')){playlist = [];
            currentPlaylistSort = null;
            resetSorts(document.querySelectorAll('.playlistTableHead'));}
         updatePlaylist();
   }

   /**
    * 
    * Keeps the playlist table up to date, makes sure it's in the order the user has currently specified.
    */

   function updatePlaylist(){
      localStorage.setItem('playlist', JSON.stringify(playlist));
      if(currentPlaylistSort!==null){
         playlist.sort(sortingFunctions[currentPlaylistSort]);
         if(checkIfReversed('playlistTableHead')){
            playlist.reverse();
         }
      }
      populateTable(document.querySelector('#playlistTable'), playlist);
   }

   function checkIfReversed(tableHead){
      let reversed = document.querySelector(`.rearrange.${tableHead}.selected`);
      console.log(reversed != null && reversed.firstChild.classList.contains('rotated'));
      return reversed != null && reversed.firstChild.classList.contains('rotated');

   }

   /**
    * 
    * @param {*} thisSong
    * 
    * removes a song from the playlist, returns the new playlist
    */

   function removePlaylistSong(thisSong){
      playlist= playlist.filter((song)=>{
         return !(thisSong.song_id == song.song_id);
      });
   }
   /**
    * 
    * @param {} song 
    * 
    * Shows the song name
    */

   function showName(song){
      popupText(`${song.title}`);
   }

   /**
    * 
    * @param {*} list the list of songs
    * @param {*} item the trigger that has the song's id as its data id.
    * @returns a song from the list.
    */

   function findSong(list, item){

      return list.find((song)=>{

         return (song.song_id == item.dataset.id)||(song.title == item.dataset.id);
      })
   }

   /**
    * 
    * @param {} event Listens to the head of the table for when an item in there is clicked
    * 
    * This listens to the head and associated items through event delegation. Then rearranges the table according to what needs to be ordered.
    */

   function rearrangeTable(target){

      if(target.classList.contains('arrow')){
         target = target.parentElement;}
      if(target.classList.contains('rearrange')){
         let tbody = document.querySelector(`#${target.dataset.table}`);
         let criteria = target.dataset.id;
         if(tbody.id =='searchList'){
            rearrangeSearchTable(criteria, tbody, target, selectedSort);
         }
         else if(tbody.id =='playlistTable'){
            rearrangeSearchTable(criteria, tbody, target, playlist);
            currentPlaylistSort = [criteria];}}}


   /**
    * 
    * @param {} criteria the criteria in which we are ordering (Such as "Artist")
    * @param {*} tbody the body of the table we are changing
    * @param {*} header the column header that triggered this function
    * @param {*} list the playlist we are working with
    * 
    * 
    * this function reorders a table, if a given header is clicked twice, then the table is reversed according to that order.
    */
   
   function rearrangeSearchTable(criteria, tbody, header, list){
      let checkSelected = header.classList.contains('selected');
      let currentSongs=list.sort(sortingFunctions[criteria]);
      if(currentFilter!=null && currentFilter.value !='' && tbody.id =="searchList"){
            currentSongs= list.filter((song) => checkFilter(currentFilter.value, song[currentFilter.id]));}
      if(checkSelected && !(header.firstChild.classList.contains('rotated'))){
         currentSongs.reverse();
         header.firstChild.classList.toggle('rotated');}
      else{
         resetSorts(Array.from(document.querySelectorAll(`.${header.dataset.table}Head`)));
         header.classList.add('selected');}
      populateTable(tbody, currentSongs);}


      /**
       * 
       * @param {} tableHeads 
       * 
       * 
       * resets the sorting.
       */


   function resetSorts(tableHeads){
      console.log(tableHeads);
      for(let colHead of tableHeads){
         colHead.classList.remove('selected');
         colHead.firstChild.classList.remove('rotated');}};

   /**
    * 
    * @param {*} resetted the box to reset.
    * 
    * Resets all input boxes.
    */
   function resetBoxes(resetted){
      resetted.forEach(function(option)
      {
         option.disabled = true;
         currentFilter =null; })   }
   /**
    * 
    * @param {*} table the list
    * @param {*} list the array we are using to fill the list
    * 
    * populates the "Top" lists on the main page
    */

   function populateTopTable(table, list){
      table.innerHTML="";
      for(let i = 0; i < 15; i++){
         let newRow = document.createElement("li");
         if(typeof list[i]==='object'){
            newRow.innerHTML = list[i]['title'];
            newRow.dataset.id = list[i]['title'];
            newRow.dataset.type = 'title';
            newRow.classList.add('songLink');
         }
         else{
            let splitWord = list[i].split('|')
            newRow.innerHTML = splitWord[0];
            newRow.dataset.id = splitWord[1]; 
            newRow.dataset.type = splitWord[2];
         }
         newRow.classList.add('link');
        table.appendChild(newRow);
     }
   }   

   /**
    * 
    * @param {*} discriminator the property in each song we are looking at
    * @returns a string to be parsed containing both the ID, and name of the genre/artist, and whether it is a genre or artist
    * 
    * This function orders an item by how many common songs have the same property.
    */

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
    * @param { } song the song to be shown
    * 
    * This makes the layour of the single song view 
    */

   function singleSongViewer(song) {
      
         let infoOrder= [['Title: ',song.title], ['Artist: ',song.artist.name], ['Year: ',song.year], ['Genre: ', song.genre.name],
          ['Duration: ', `${Math.floor(song.details.duration / 60)}m:${(song.details.duration % 60)}s`]];
         let songInformationList = document.querySelector("#songInformation");
         songInformationList.innerHTML=""
         for(item of infoOrder){
            let li = document.createElement('li');
            li.innerHTML= `${item[0]}${item[1]}`
            songInformationList.appendChild(li);}
         let analysisData = [['BPMs', song.details.bpm], ['Energy', song.analytics.energy], ['Danceability', song.analytics.danceability],
            ['Liveness', song.analytics.liveness], ['Valence', song.analytics.valence], ['Acoustic', song.analytics.acousticness], ['Speechiness', song.analytics.speechiness],
            ['Popularity', song.details.popularity]];
         let analysisDataList = document.querySelector("#analysisData");
         analysisDataList.innerHTML=""
         for (let item of analysisData) {
            let li = document.createElement('li');
            li.style.backgroundColor = "rgba(99, 46, 222, 0.8)";
            li.style.width = "90%";
            li.innerHTML = `<div class="progressBar" style="width:${item[1] / 2}%;">${item[0]}: ${item[1]}</div>`;
            analysisDataList.appendChild(li);}
         console.log(`Putting ${song.title} into makeRadarChart`);
         let existingChart = Chart.getChart(document.querySelector('#radarChart'));
         if(existingChart){
            existingChart.destroy();}
         makeRadarChart(song);
   }

/**
 * 
 * @param {*} song Contains song object to make the radar chart for
 * 
 * Makes the radar chart from song object for Single Song Viewer, in particular the data from song.analytics
 */
   function makeRadarChart(song){
      const labels = ['Energy', 'Danceability', 'Liveness', 'Valence', 'Acoustic', 'Speechiness'];
      const ctx = document.getElementById('radarChart').getContext('2d');
      
      const radarChart = new Chart(ctx, {
         type: 'radar',
         data: {
               labels: labels,
               datasets: [{
                  label: song.title,
                  data: [song.analytics.energy, song.analytics.danceability,song.analytics.liveness, song.analytics.valence, song.analytics.acousticness, song.analytics.speechiness],
                  backgroundColor: 'rgba(255, 99, 132, 0.2)',
                  borderColor: 'rgba(255, 99, 132, 1)',
                  borderWidth: 1
               }]
         },
         options: {
            scales: {
              r: {
                  pointLabels: {
                  font: { size: 17,},
                  color: 'white'
                  },
                  grid: {color: 'white'  },
                  angleLines: {color: 'white'},                
              }
            },
            plugins: {
               legend: {
                   labels: {
                       color: 'white', 
                       font: {size: 24}
                   }
               }
            }
         }
      });
      console.log(`Radar Chart created for ${song}`);              
    }
});
