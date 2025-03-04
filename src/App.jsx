import { useEffect, useState } from 'react'
import axios from "axios";
import moment from "moment";

function App() {
  
  const [oras,setOras] = useState("Brasov");
  const [data,setData] = useState(null);
  const [data5zile,setData5zile] = useState(null);
  const [iconIndex,setIconIndex] = useState(0);
  const [iconIndex5,setIconIndex5] = useState([0,1,2,0,1]);
  const icons = ["/clouds.svg","/rain.svg","/snow.svg","/sun.svg"];
  

  const fetchData = async () => {
    try {
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
     
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${oras}&appid=${apiKey}&units=metric`
      );
      setData(response.data);
      

      const response2 = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${oras}&appid=${apiKey}&units=metric`);
      setData5zile(response2.data);
      console.log(response2.data);
      
    
    } catch (error) {
      console.error('Error',error);
      alert("Invalid city");
    
    }
  };   

  useEffect(() => {
    fetchData();
  }, [])

  useEffect(() => {
   if(data){
    handleIcon();
    handleIcon5();
   }
  }, [data]);

  


  function handleOras(event)
  {
      setOras(event.target.value);
  }

  function handleVerificare(event)
 {
  if(event.key === 'Enter')
  {
    fetchData();
  }
 }

 function handleIcon()
 {
    const weather = data.weather[0].main.toLowerCase();
    if(weather === 'snow')
      setIconIndex(2);
    else if(weather === 'rain')
      setIconIndex(1);
    else if(weather === 'clear')
      setIconIndex(3);
    else if(weather === 'clouds')
      setIconIndex(0);
 }

 function handleIcon5() {
  if (!data5zile) return;

  const indices = [6, 14, 21, 29, 37]; 
  const newIcons = indices.map(i => {
    const weather = data5zile.list[i]?.weather[0]?.main.toLowerCase();
    switch(weather) {
      case 'snow': return 2;
      case 'rain': return 1;
      case 'clear': return 3;
      case 'clouds': return 0;
      default: return 0;
    }
  });
  
  setIconIndex5(newIcons);
}

  return (
   <>
   {data && data5zile ? (
    <>
   <div className="background-image">
     <div className=' lg:ml-50 lg:mt-25  lg:mr-45 fixed inset-0 bg-gradient-to-r from-black/55 to-black/15 overflow-y-auto  lg:overflow-y-hidden pb-0 mb-0'>
      
      <div className='flex justify-center lg:pt-5 lg:pb-4'>
      <input className=' border-1 p-2 outline-none rounded-l-[25px] border-r-0 w-[75%] mt-5 text-2xl' 
      placeholder='Search your location'
      value={oras}
      onChange={handleOras}
      onKeyDown={handleVerificare}>
      </input>
      <img src='search.svg' className='w-8 mt-5 border-1 border-l-0 rounded-r-[25px] cursor-pointer'
      onClick={fetchData}></img>
      </div>

      <p className='lg:text-2xl ml-6 pt-5'>Daily Forcast</p>
      <div className='lg:p-10 p-5 '>
      <p className='lg:text-3xl text-2xl'>{data.sys?.country}, {data.name}</p>
      <p>{moment.unix(data.sys.sunrise).format("dddd, MMMM Do Y")}</p>
      </div>

  
   <div className="grid lg:grid-cols-4 lg:grid-rows-3 lg:gap-4 justify-center items-center xl:p-2 xl:text-3xl p-10 3xl:text-5xl 3xl:mt-10">
   <div className='w-[50%] place-self-center'> <img src={icons[iconIndex]}></img> </div>
   <div className='place-self-center mt-[10%] mb-[20%] text-[50px] lg:mt-0 xl:text-7xl 3xl:text-9xl'>
   <p className=''>{Math.round(data.main.temp)}°C</p>
   <p className='text-xl'>{data.weather[0].description}</p>
  </div>

  
  <div className='grid grid-cols-3 grid-rows-2 gap-4 place-self-center lg:col-span-2 gap-20 py-0 mt-0 '>
  <div>
   <p className=''>{Math.round(data.main.temp_max)}°C</p>
   <p className='text-sm'>HIGH</p>
  </div>
  <div>
   <p className=''>{data.wind.speed} km/h</p>
   <p className='text-sm'> wind speed</p>
  </div>
  <div>
   <p className=''>{moment.unix(data.sys.sunrise).format("h:mm A")}</p>
   <p className='text-sm'>sunrise</p>
  </div>
  <div>
   <p className=''>{Math.round(data.main.temp_min)}°C</p>
   <p className='text-sm'>low</p>
  </div>
  <div>
   <p className=''>{data.main.humidity}%</p>
   <p className='text-sm'>humidity</p>
  </div>
  <div>
   <p className=''>{moment.unix(data.sys.sunset).format("h:mm A")}</p>
   <p className='text-sm'>sunset</p>
  </div>
  </div>

  <div className='lg:col-span-4 overflow-x-auto'>
  <div className='grid grid-cols-5 text-center gap-20 min-w-[850px]  lg:text-2xl p-4 3xl:text-3xl 3xl:p-5 lg:mt-16 mt-4 '>
   
    <div>
      <span>{moment.unix(data5zile.list[6].dt).format("dddd")}</span>
      <p className='mt-2 3xl:mt-5'>Temperature {Math.round(data5zile.list[6].main.feels_like)}°C</p>
      <img className=' mt-3 w-[25%]  3xl:mt-6 place-self-center' src={icons[iconIndex5[0]]}></img>
    </div>

    <div>
    <span>{moment.unix(data5zile.list[14].dt).format("dddd")}</span>
    <p className='mt-2 3xl:mt-5'>Temperature {Math.round(data5zile.list[14].main.feels_like)}°C</p>
    <img className=' mt-3 w-[25%]  3xl:mt-6 place-self-center' src={icons[iconIndex5[1]]}></img>
    </div>

    <div>
    <span >{moment.unix(data5zile.list[21].dt).format("dddd")}</span>
    <p className='mt-2 3xl:mt-5' >Temperature {Math.round(data5zile.list[21].main.feels_like)}°C</p>
    <img className=' mt-3 w-[25%]  3xl:mt-6 place-self-center' src={icons[iconIndex5[2]]}></img>
    </div>

    <div>
    <span>{moment.unix(data5zile.list[29].dt).format("dddd")}</span>
    <p className='mt-2 3xl:mt-5'>Temperature {Math.round(data5zile.list[29].main.feels_like)}°C</p>
    <img className=' mt-3 w-[25%]  3xl:mt-6 place-self-center' src={icons[iconIndex5[3]]}></img>
    </div>
    <div>

    <span>{moment.unix(data5zile.list[37].dt).format("dddd")}</span>
    <p className='mt-2 3xl:mt-5'>Temperature {Math.round(data5zile.list[37].main.feels_like)}°C</p>
    <img className=' mt-3 w-[25%]  3xl:mt-6 place-self-center' src={icons[iconIndex5[4]]}></img>
    </div>


  </div>
  </div>

</div>
     </div>
     </div>
     </>) : (<p>Loading</p>)}
   </>
  )
}


export default App
