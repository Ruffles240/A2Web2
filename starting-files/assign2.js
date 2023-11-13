


/* url of song api --- https versions hopefully a little later this semester */	
const api = 'http://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php';



addEventListener("DOMContentLoaded", async (event) =>{
   var music = await localStorage.getItem("data");
   var artists = await localStorage.getItem("./starting-files/genres.json");

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
      

   console.log(music);

   async function fetchData(URL) {
      var response = await fetch(URL).then(response => response.json());
      console.log(response);
      return response;
  }

   console.log("Loaded");


  
   var pages = Array.from(document.querySelector("main").children);

   document.querySelector("#homeButtons").addEventListener("click", (event) => {

      pages.forEach(function(page) {


         if (((page.dataset.id === event.target.id)&& (page.classList.contains("hide"))) ||
         
         
         (page.dataset.id != event.target.id)&& (!page.classList.contains("hide"))) {
            page.classList.toggle("hide");
         }
     });

   }

  
   
   );

   var filter= document.querySelector("#filter");
   var selectBars = document.querySelectorAll(".select");
   
   filter.addEventListener("change", (event)=>{

      

      if(event.target.type==="radio"){
         selectBars.forEach(function(option)
         {
         
            option.disabled = true;
            

         })
            
         document.querySelector(`#${event.target.dataset.id}`).disabled = false;



      }
      

   });


   document.querySelector("#listSongs").addEventListener("click", (event) =>{

      

         for(song of music){
             var newRow = document.createElement("tr");
             newRow.innerHTML = `
             <td>${song.title}</td>
             <td>${song.artist.name}</td>
             <td>${song.genre.name}</td>
             <td>${song.year}</td>
            `;
            document.querySelector("#searchList").appendChild(newRow);
         }
      


   })


   });

   





 

/* note: you may get a CORS error if you try fetching this locally (i.e., directly from a
   local file). To work correctly, this needs to be tested on a local web server.  
   Some possibilities: if using Visual Code, use Live Server extension; if Brackets,
   use built-in Live Preview.
*/
