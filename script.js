
import * as fonction from './fonctions.js'

/***** Déclaration variables et constantes *****/

const api_URL='https://sophie-bluel-backend-hrep.onrender.com'
// Envoi d'un fetch pour récup. des travaux sur l'API
const respProjects=await fetch(`${api_URL}/api/works`)
const projects=await respProjects.json()

// Envoi d'un fetch pour récup. des catégories
const respCategories=await fetch (`${api_URL}/api/categories`)
const categories= await respCategories.json()

//Récupération du token (Null si inexistant)
const token=fonction.getToken()

// constantes générales
const filters=document.getElementById("filters")
const gallery=document.querySelector(".gallery")

//mode édition
const editionMode=document.getElementById("edition-mode")
const header=document.getElementById("header")
const log=document.getElementById("log")
const modifier=document.getElementById("modifier")

// modale
const modale=document.getElementById("modale")
const modaleBtnClose=document.querySelectorAll(".modale-btn-close")
const modaleAddButton=document.querySelector(".add-button")
const inputPhotoBtn=document.getElementById("input-photo")
const form=modale.querySelector("form")
const galerieModeContent=modale.querySelector(".galerie-photo .content")
const submitButton=modale.querySelector(".validate-button")

const openModal=function (e){
   console.log("ouverture modale")

   modale.classList.remove("hidden")
   modale.removeAttribute("aria-hidden")
   modale.setAttribute("aria-modal","true")
   
   modale.addEventListener("click",closeModal)
   modale.querySelector(".modal-wrapper").addEventListener("click",stopPropagation)
   modaleBtnClose.forEach((button)=>{button.addEventListener("click",closeModal)})
   modaleAddButton.addEventListener("click",showAddPhotoMode)
   form.addEventListener("submit",submitAjoutPhoto)

   fonction.showGaleriePhotoModale(modale)
   fonction.fillCategoryForm(categories)
}

const closeModal=function (e){
   console.log("fermeture modale")
   modale.classList.add("hidden")
   modale.setAttribute("aria-hidden","true")
   modale.removeAttribute("aria-modal")

   fonction.effacerContenuBalise(galerieModeContent)
   document.getElementById("picture-error").classList.add("hidden")
   submitButton.classList.remove("green")

   modale.removeEventListener("click",closeModal)
   modale.querySelector(".modal-wrapper").removeEventListener("click",stopPropagation)
   modaleBtnClose.forEach((button)=>{removeEventListener("click",closeModal)})
   modaleAddButton.removeEventListener("click",showAddPhotoMode)
   inputPhotoBtn.removeEventListener("change",fonction.previewUpload)
   form.removeEventListener("input",fonction.fieldsVerification)    
   form.removeEventListener("submit",submitAjoutPhoto)

   fonction.trashPhotoPreview()
   fonction.trashAllFields()
   fonction.clearCategoryForm()
   fonction.hideModalAddMode(modale)
}

const stopPropagation=function (e){
   e.stopPropagation()
}

const submitAjoutPhoto=(e)=>{
   fonction.submitPictureForm(e,closeModal)
}

const showAddPhotoMode=(e)=>{
   fonction.showAddPhotoModale(e,modale)
}

/******/

fonction.afficherProjets(projects)

if (!token){// Mode visualisation
   // Ouverture de la page en mode consultation
   editionMode.classList.add("hidden")//
   modifier.classList.add("hidden")//

   // Création des boutons de filtre + gestionnaire d'évènements
   fonction.createBtnFilterTous()
   console.log("Création des boutons filtre de chaque catégorie")
   categories.forEach(categorie=>{//
      fonction.createBtnFilter(categorie)
   })
   fonction.addEventListenerButtonFilter(projects)//
}

else{// Mode Edition
   //Ouverture de la page en mode edition
   editionMode.classList.remove("hidden")//
   header.classList.add("marge-top-110")
   modifier.classList.remove("hidden")//
   filters.classList.add("hidden")//
   log.innerText="logout"
   log.setAttribute("href","index.html")
   log.addEventListener("click",()=>{
      localStorage.removeItem("token")
      console.log("Effacement token")
   }) 
   modifier.addEventListener("click",openModal)
}



