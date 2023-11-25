


/* url of song api --- https versions hopefully a little later this semester */	
const api = 'https://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php';

console.log('this is secure');



addEventListener("DOMContentLoaded", async (event) =>{

   var playlist = localStorage.getItem('playlist');

   if(playlist ===null){

      playlist = [];
   }

   else{

      playlist = JSON.parse(playlist);
   }
   populateTable(document.querySelector('#playlistTable'), playlist);


   var music = await localStorage.getItem("data");
   var artists = await fetchData("./starting-files/artists.json");
   var genres = await fetchData("./starting-files/genres.json");
   var currentFilter;

   if(music ===null){
      music = await fetchData(api);
      localStorage.setItem("data", JSON.stringify(music));

   }

   else {
      music = JSON.parse(music);

   }

   var sortingFunctions = {
      'year' : function (a,b) {return b.year - a.year},
      'genre' :  function (a,b){return a.genre.name.localeCompare(b.genre.name)},
      'artist' : function(a,b) {return a.artist.name.localeCompare(b.artist.name)},  
      'title' :  function (a,b) { return a.title.localeCompare(b.title)}
   }



   var selectedSort = music;




   async function fetchData(URL) {
      var response = await fetch(URL).then(response => response.json());
      return response;
  }

   populateSelect(genres ,document.querySelector('#genre'));
   populateSelect(artists ,document.querySelector('#artist'));

  function populateSelect(populator, select){

   for(item of populator){
      let option = document.createElement('option');
      option.innerHTML=item.name;
      option.value=item.id;

      select.appendChild(option);
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
  
   var pages = Array.from(document.querySelector("main").children);

   document.querySelector("#homeButtons").addEventListener("click", (event) => {

      pages.forEach(function(page) {

         if(event.target.classList.contains("header-div")){
         if (((page.dataset.id === event.target.id)&& (page.classList.contains("hide"))) ||
         
         
         (page.dataset.id != event.target.id)&& (!page.classList.contains("hide"))) {
            page.classList.toggle("hide");
         }}
     });

   }
   
   );
   const selectBars = Array.from(document.querySelectorAll(".select"));

   document.querySelectorAll("input[type='radio']").forEach((radio) =>  {radio.addEventListener("change", (event)=>{

      if(event.target.type==="radio"){

         resetBoxes(selectBars);
         
         currentFilter = document.querySelector(`#${event.target.dataset.id}`);
         currentFilter.disabled = false;

      }      

   })});

   populateTable(document.querySelector('#searchList'), selectedSort);

   var listButtons = document.querySelector("#listSongs");

   listButtons.addEventListener("click", (event) =>{
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

            alert('Please choose a search option.')
         }

         }
   )

   function checkFilter(value, filter) {
      if(typeof filter ==='object'){

         filter = filter['id'];
         return filter==value;
      }

      return filter.toLowerCase().includes(value.toLowerCase());
    }
      
   document.querySelector("#clear").addEventListener("click", (event) =>{

      event.stopPropagation();
  
            resetBoxes(selectBars);
            selectedSort=music;
            populateTable(document.querySelector('#searchList'), music);

         
      }
   )

   function populateTable(table, list){

      table.innerHTML="";

      for(song of list){
         var newRow = makeRow(table, song);
        
         table.appendChild(newRow);
      }

   }

   function makeRow(table, song){

      var type= ''

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
      newRow.innerHTML = `<td data-type = "title" data-id="${song.title}">${shortenedTitle}</td><td data-type = "artist" data-id= "${song.artist.name}">${song.artist.name}</td><td data-type = "genre" data-id="${song.genre.name}">${song.genre.name}</td><td data-type = "year" data-id = "${song.year}">${song.year}</td><td data-type = "button" ><button  type= 'button' data-id = '${song.song_id}' ${type} </button></td>`;
      return newRow;
   }

   var tables = document.querySelectorAll('table');

   tables.forEach((table)=>  
      table.addEventListener('click', (event)=>
      
      {
            if(event.target.classList.contains('titleEllipse'))
            {
               const thisSong = music.find((song) => {
                  return song.song_id == event.target.dataset.id});
               popupText(`${thisSong.title}`);
            }

            const thisSong =music.find((song) =>{
               return song.song_id == event.target.dataset.id}
               );
            if(event.target.classList.contains("addPlaylist")){
               if(typeof (playlist.find((playlistSong) => 
               {
                  return playlistSong.song_id == event.target.dataset.id
               }
               )) !== 'undefined'){
                  alert('This song is already in the playlist');
               }
               else{
                  playlist.push(thisSong);
   
                  localStorage.setItem('playlist', JSON.stringify(playlist));
                  populateTable(document.querySelector('#playlistTable'), playlist);
               }
            }
            else if(event.target.classList.contains('removePlaylist')){
               playlist = playlist.filter((song)=>{
                  return !(thisSong.song_id == song.song_id);
               })
            }
            else if(event.target.classList.contains('clearPlaylist')){
               playlist = [];
            }
            localStorage.setItem('playlist', JSON.stringify(playlist));
            populateTable(document.querySelector('#playlistTable'), playlist);
      }
   
   ));
   var tableHeads= document.querySelectorAll('thead')
   
   tableHeads.forEach((th) => {
      th.addEventListener('click', (event) => {
         if(event.target.classList.contains('rearrange')){
            var tbody = document.querySelector(`#${event.target.dataset.table}`);
          
            var criteria = event.target.dataset.id;
            
            if(tbody.id =='searchList'){
               selectedSort.sort(sortingFunctions[`${criteria}`]);
                  var currentSongs=selectedSort;

                  if(currentFilter!=null && currentFilter.value !=''){
                      currentSongs= selectedSort.filter((song) => checkFilter(currentFilter.value, song[currentFilter.id]));

                  }

                  populateTable(tbody, currentSongs);

           
               
            }
            else if(tbody.id =='playlistTable'){

               playlist.sort(sortingFunctions[`${criteria}`]);

               populateTable(tbody, playlist);

               
            }
         }
      } 
      )
   })

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


         }

         else{

            let splitWord = list[i].split('|')

            newRow.innerHTML = splitWord[0];

            newRow.dataset.id = splitWord[1]; 
         }


        table.appendChild(newRow);
     }
   }

   document.querySelectorAll('.mainList');

   var topArtists = findFreq('artist');

   var topGenres = findFreq('genre');

   let popularitySort= music.toSorted((a,b) => {
      return b.details.popularity - a.details.popularity;

   })

   populateTopTable(document.querySelector('#topArtists'), topArtists);
   populateTopTable(document.querySelector('#topGenres'), topGenres);
   populateTopTable(document.querySelector('#topSongs'), popularitySort);

   function findFreq(discriminator, location) {
      let freqs = {};

      for (let song of music) {

         if (freqs[`${song[discriminator]['name']}|${song[discriminator]['id']}`] === undefined) { 
            freqs[`${song[discriminator]['name']}|${song[discriminator]['id']}`] = 1; 
         } else {
            freqs[`${song[discriminator]['name']}|${song[discriminator]['id']}`] += 1;
         }
      }
      let frequencyArray = [];
      for (key in freqs) {
          frequencyArray.push([freqs[key], key]);
      }
      frequencyArray.sort((a, b) => {
         return b[0] - a[0];
     });
     mostFreq = [];
     for (let i = 0; i < 15; i++) {
         mostFreq.push(frequencyArray[i][1]);
     }
     
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
