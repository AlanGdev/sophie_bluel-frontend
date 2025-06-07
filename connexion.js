/******Page de connexion******/
const formulaire=document.querySelector("form")
const api_URL='https://sophie-bluel-backend-hrep.onrender.com'

formulaire.addEventListener("submit",async(e)=>{
    e.preventDefault()
    const email=formulaire.querySelector('[name=email]').value
    const password=formulaire.querySelector('[name=password]').value
    try{//
        const response=await fetch(`${api_URL}/api/users/login`,{
            method:"POST",
            headers:{
                "content-type":"application/json",
                "accept":"application/json"
            },
            body:JSON.stringify({"email":email,"password":password})
        })

        if(!response.ok){//
            throw new Error(`Erreur de connexion ${response.status}`)//
        }
        const data=await response.json()//
        localStorage.setItem('token',data.token)//
        console.log(data.token)

        window.location.href='./index.html'//
    }
    catch (error){//
        console.log(`Une erreur est survenue: ${error.message}`)
        document.getElementById("error-message")//
            .classList.remove("hidden")//
        localStorage.removeItem("token")//
    }
})