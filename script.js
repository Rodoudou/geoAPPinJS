document.addEventListener("DOMContentLoaded", () => {
    const section = document.querySelector('section');
    const load = document.getElementById('load');
    
    
    const success=async(pos)=>{
        console.log("pos =>",pos);
        const crd = pos.coords;
        const {latitude:lat, longitude:lon} = crd;
        
        affichageDatas(lat,lon)
        
    }
    
    const error = async ()=>{
        try {
            const dataIp = await window.fetch(`https://api.ipify.org?format=json`);
            const res = await dataIp.json()
            .then( resJson => window.fetch(`https://api.ipstack.com/${resJson.ip}`)
                .then(res => res.json())
                .then(info =>{

                console.log("info =>",info);
                const {latitude:lat,longitude:lon} = info;
                affichageDatas(lat,lon)
                })
            )
        } catch (error) {
            console.error(error);
        }
    }

    
    //Helpers
    const capitalize=(text)=>{
        return text.toUpperCase()
    }
    
    const formatDeg=(deg)=>{
        return Math.floor(deg)+" C°"
    }
    
    const formatText=(text)=>{
        text = text 
        .split(' ')
        .map((mot)=> mot[0].toUpperCase()+ text.slice(1))
        .join()
        
        return text;
        
    }
    
    
    const affichage=(meteo)=>{
        load.style.display ='none';
        
        console.log(meteo);
        const {description,icon} = meteo.weather[0];
        console.log("######",meteo.name);
        const{temp}= meteo.main;
        
        const html = `
        <div>
        <h2>${capitalize(meteo.name)}</h2>
        <img src="http://openweathermap.org/img/w/${icon}.png" >
        <p>${formatText(description)}</p>
        <p class="temp">${formatDeg(temp)}</p>
        </div>
        `
        section.innerHTML = html;
    }
    
    navigator.geolocation.getCurrentPosition(success,error)
    
    //Gestion des erreurs
    const catchErors = (fn)=>{
        return()=>{
            return fn().catch(error => console.error("error in catchErrors =>",error));
        } 
    }
    
    //Recuperer la data de l'API
    const affichageDatas = async(lat,lon)=>{
        
        const AppiID = `1c0cf0e0d198e70a7c2a5b12074677b3`;
        const fetchDatas = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=fr&units=metric&appid=${AppiID}`); //1c0cf0e0d198e70a7c2a5b12074677b3
        const res = await fetchDatas;
        const meteo = await res.json();
        
        affichage(meteo)
    }
    
    
    
    
    const safeAffichageDatas = catchErors(affichageDatas);
    safeAffichageDatas();
    
    
    
    
    
    
    
    
    
    
});