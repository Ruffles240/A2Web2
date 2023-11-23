


/* url of song api --- https versions hopefully a little later this semester */	
const api = 'http://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php';



addEventListener("DOMContentLoaded", async (event) =>{
   var music = await localStorage.getItem("data");
   var artists = await fetchData("./starting-files/artists.json");
   var genres = await fetchData("./starting-files/genres.json");

   console.log('got the other data');

   if(music ===null){
      music = await fetchData(api);
      console.log("getting the data");
      localStorage.setItem("data", JSON.stringify(music));

   }
   else {
      console.log("got the data");
      music = JSON.parse(music);

   }



   var yearList = music.toSorted((a,b) => (b.year - a.year));
   var genreList = music.toSorted((a,b) => (a.genre.name.localeCompare(b.genre.name)));
   
   var titleList = music.toSorted((a,b) => (a.title.localeCompare(b.title)));

   console.log(yearList);



   async function fetchData(URL) {
      var response = await fetch(URL).then(response => response.json());
      console.log(response);
      return response;
  }

   console.log("Loaded");

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

  
   var filter= document.querySelector("#filter");
   const selectBars = Array.from(document.querySelectorAll(".select"));

   document.querySelectorAll("input[type='radio']").forEach((radio) =>  {radio.addEventListener("change", (event)=>{



      if(event.target.type==="radio"){
         populateTable(document.querySelector('#searchList'), music);

         resetBoxes(selectBars);
         document.querySelector(`#${event.target.dataset.id}`).disabled = false;



      }
      

   })});

   populateTable(document.querySelector('#searchList'), music);


   

   document.querySelector("#listSongs").addEventListener("click", (event) =>{
      
         event.stopPropagation();
         const thisSearch = selectBars.find((bar) => {


            return bar.disabled === false;
         });

         if(thisSearch!=null){
            let searchedValue = thisSearch.id;


            populateTable(searchTable, music.filter((song) => checkFilter(thisSearch.value, song[searchedValue])));
            
         }

         else{

            alert('Please choose a select option.')
         }

         }
   )

   function checkFilter(value, filter) {
      if(typeof filter ==='object'){

         filter = filter['id'];
         console.log(value + ' ' + filter);
         return filter==value;
      }

      console.log(value + ' ' + filter);

      return filter.toLowerCase().includes(value.toLowerCase());
    }
      
   document.querySelector("#clear").addEventListener("click", (event) =>{

      event.stopPropagation();
  
            resetBoxes(selectBars);
            populateTable(document.querySelector('#searchList'), music);
         
      }
   )



   function populateTable(table, list){

      table.innerHTML="";

      for(song of list){
         var newRow = document.createElement("tr");
         var shortenedTitle= song.title.substring(0,24);
         if(song.title.length>25){
            shortenedTitle = shortenedTitle.substring(0, 23);
            shortenedTitle += `<button class="titleEllipse" data-id = ${song.song_id}>`+ '&hellip;'+ '</button>';
         }
         newRow.innerHTML = `
         <td>${shortenedTitle}</td>
         <td>${song.artist.name}</td>
         <td>${song.genre.name}</td>
         <td>${song.year}</td>
        `;
        table.appendChild(newRow);
     }


     

   }

   var searchTable = document.querySelector('#searchList');

   searchTable.addEventListener('click', (event)=>
   
   {
         if(event.target.classList.contains('titleEllipse'))
         {
            const thisSong = music.find((song) => {
               return song.song_id == event.target.dataset.id});
            alert(`${thisSong.title}`);
         }
   }
   
   );

   function resetBoxes(resetted){

      resetted.forEach(function(option)
      {
      
         option.disabled = true;
         

      })
      
   }


   console.log(topSongs);

   function populateTopTable(table, list){

      table.innerHTML="";

      for(let i = 0; i < 15; i++){
         var newRow = document.createElement("li");
         
         if(typeof list[i] === "object"){

            newRow.innerHTML = `${list[i]['title']}`;

         }
         else{
         newRow.innerHTML = `${list[i]}`;}
        table.appendChild(newRow);
     }
   }

  

   var topArtists = findFreq('artist','name');

   var topGenres = findFreq('genre','name');

   let popularitySort= music.toSorted((a,b) => {
      return b.details.popularity - a.details.popularity;


   })

   populateTopTable(document.querySelector('#topArtists'), topArtists);
   populateTopTable(document.querySelector('#topGenres'), topGenres);
   populateTopTable(document.querySelector('#topSongs'), popularitySort);





   function findFreq(discriminator, location) {
      let freqs = {};
      
    
      for (let song of music) {

         if (freqs[song[discriminator][location]] === undefined) { 
            freqs[song[discriminator][location]] = 1; 
         } else {
            freqs[song[discriminator][location]] += 1;
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

   });

 
   

   





 

/* note: you may get a CORS error if you try fetching this locally (i.e., directly from a
   local file). To work correctly, this needs to be tested on a local web server.  
   Some possibilities: if using Visual Code, use Live Server extension; if Brackets,
   use built-in Live Preview.
*/
