const api_URL='https://sophie-bluel-backend-hrep.onrender.com'

/*****Fontions générales */
async function getProjects() {
    const response=await fetch(`${api_URL}/api/works`)
    const projects=await response.json()

    return projects
}

export function effacerContenuBalise(balise){
    balise.innerHTML=''//
}

export function getToken(){//
    const token=localStorage.getItem("token")
    console.log(`Récup. token: ${token}`)

    return token
}

/*****Fonctions page principale */

export function afficherProjets(projets){//
    //affichage projets dans la classe .gallery
    console.log("Affichage Portfolio")

    const gallery=document.querySelector(".gallery")//

    projets.forEach(item=>{
        let figureBal=document.createElement('figure')
        figureBal.innerHTML=`
            <img src=${item.imageUrl} alt=${item.title}>
            <figcaption>${item.title}</figcaption>
            `//
        figureBal.setAttribute("data-figNumber",`${item.id}`)//
        gallery.appendChild(figureBal)
    })
}

function defineClassFilterBtn(btn,newClass){
    // Effacement de la classe du bouton et ajout de la nouvelle classe
    btn.className="" 
    btn.classList.add(newClass)
}

export function createBtnFilterTous(){
    // création du bouton filtre "Tous" dejà cliqué (filter-btn-clicked)
    console.log("Création bouton filtre Tous")

    const filters=document.getElementById("filters")

    filters.innerHTML=`
    <button data-id="Tous" class="filter-btn-clicked">Tous</button>
    `
}

export function createBtnFilter(categorie){//
    // Création d'un bouton filtre catégorie
    const filters=document.getElementById("filters")
    const btn=document.createElement("button")//

    btn.setAttribute("data-id",`${categorie.id}`)//
    btn.innerText=`${categorie.name}`//
    defineClassFilterBtn(btn,"filter-btn")
    filters.appendChild(btn)
}

export function addEventListenerButtonFilter(projets){//
    // Gestionnaire d'évenement pour affichage projets par catégorie
    console.log("Ajout eventListener boutons filtres")

    const filtersbal=document.getElementById("filters")
    const filters=filtersbal.querySelectorAll("button")
    const gallery=document.querySelector(".gallery")

    filters.forEach(filterbtn=>//
        filterbtn.addEventListener("click",()=>{
            //Passage de cliqué en non cliqué sur ancien bouton
            filters.forEach(filter=>{
                if(filter.classList.contains("filter-btn-clicked")){
                    defineClassFilterBtn(filter,"filter-btn")
                }
            })
            //Passage en cliqué sur bouton actuel
            defineClassFilterBtn(filterbtn,"filter-btn-clicked")//
            // Enregistrement de l'Id de la catégorie
            let id=filterbtn.dataset.id//
            // Création liste projets filtrés
            const filteredProjects=(()=>{
                if(id!=="Tous"){
                    return projets.filter((projet)=>{//
                        return projet.category.id===Number(id)//
                    })
                }
                else{
                    return[...projets]//
                }
            })()

            effacerContenuBalise(gallery)//
            afficherProjets(filteredProjects)//
        })
    )
}

/*****Fonctions Modale - Galerie Photo */

export async function showGaleriePhotoModale(modale){//
    console.log("Modale mode Galerie Photos")

    //Modale - Mode Galerie Photo
    const content=modale.querySelector(".content")
    const projects=await getProjects()//

    effacerContenuBalise(content)

    projects.forEach(projet=>{
        const figure=document.createElement("figure")
        figure.innerHTML=`
        <img src=${projet.imageUrl} alt=${projet.title} data-id=${projet.id}>
        <button type="button" class="poub" data-id=${projet.id}><i class="fa-solid fa-trash-can"></i></button>
        `//
        figure.setAttribute("data-figNumber",`${projet.id}`)
        content.appendChild(figure)
    })

    addEventListenerTrashButton(modale)
}

function addEventListenerTrashButton(modale){//
    // Modale: Ajout d'un gestionnaire d'evt sur chaque photo de la galerie
    const buttons=modale.querySelectorAll(".poub")

    buttons.forEach(button=>{
        button.addEventListener("click",()=>{
            trashPhoto(button.dataset.id,modale)
        })
    })
}

async function trashPhoto(buttonDataId,modale){//
    //Supprime la photo de l'API et de la modale
    console.log("suppression photo de bdd et galerie modale")

    const token=getToken()//
    console.log("Envoi requête DELETE")
    const respTrash=await fetch(`${api_URL}/api/works/${buttonDataId}`,{
        method:"DELETE",
        headers:{"Authorization":`Bearer ${token}`},//
    })

    if (respTrash.ok){//
        const figure=modale.querySelector(`[data-figNumber="${buttonDataId}"]`)//
        figure.remove()//
        trashPhotoProjets(buttonDataId)//
    }
}

function trashPhotoProjets(projectId){
    // supprime photo du Portfolio 
    console.log("Suppression photo du Portfolio")

    const portfolio=document.querySelector(".gallery")
    const figure=portfolio.querySelector(`[data-figNumber="${projectId}"]`)//
    figure.remove()// 
}

export function hideModalAddMode(modale){
    //Modale: classe "ajout-photo" en hidden / Retrait de hidden sur classe "galerie-photo"
    modale.querySelector(".ajout-photo").classList.add("hidden")
    modale.querySelector(".galerie-photo").classList.remove("hidden")

}

export function showAddPhotoModale(e,modale){
    //Modale: ouverture du mode Ajout Photo
    console.log("Mode ajout photo")

    const inputPhotoBtn=document.getElementById("input-photo")
    const arrowReturn=modale.querySelector(".ajout-photo .modal-btn-arrow")
    const form=modale.querySelector("form")

    modale.querySelector(".galerie-photo").classList.add("hidden")
    modale.querySelector(".ajout-photo").classList.remove("hidden")

    inputPhotoBtn.addEventListener("change",previewUpload)
    arrowReturn.addEventListener("click",returnShowGaleriePhotoModale)
    form.addEventListener("input",fieldsVerification)    
}

export function previewUpload(event){
    console.log("test chargement photo preview")

    const file=event.target.files[0]

    if(file){
        const fileName=file.name
        const fileExtension=fileName.split(".").pop().toLowerCase()
        const fileSize=(file.size/1000)

        console.log("fichier: "+ fileSize +"ko" + " extension:"+ fileExtension)

        if (fileSize>4000 || ((fileExtension!="jpg")&&(fileExtension!="jpeg")&&(fileExtension!="png" ))){
            document.getElementById("picture-error").classList.remove("hidden")
            event.target.value=""
        }
        else{
            const modale=document.getElementById("modale")
            const inputPhoto=modale.querySelector(".ajouter-photo")
            const fileURL=URL.createObjectURL(file)
            const photoPreview=document.getElementById("photo-preview")

            document.getElementById("picture-error").classList.add("hidden")
            inputPhoto.classList.add("hidden")
            photoPreview.classList.remove("hidden")
            photoPreview.setAttribute("src",fileURL)
            photoPreview.setAttribute("alt","preview image")

            console.log("photo preview ajoutée")
        }
    }
}

export function trashPhotoPreview(){
    //On vide la balise img
    const modale=document.getElementById("modale")
    const photoPreview=document.getElementById("photo-preview")

    modale.querySelector(".ajouter-photo").classList.remove("hidden")
    photoPreview.classList.add("hidden")
    photoPreview.setAttribute("src","DefaultPhotoPreview.png")
    photoPreview.setAttribute("alt","Preview")
}

export function trashAllFields(){
    // On vide tous les champs
    const modale=document.getElementById("modale")
    const fields=modale.querySelectorAll("input,select")

    fields.forEach(field=>{
        field.value=""})
}

function returnShowGaleriePhotoModale(){

    const modale=document.getElementById("modale")
    const submitButton=modale.querySelector(".validate-button")
    const form=modale.querySelector("form")
    const inputPhotoBtn=document.getElementById("input-photo")
    const arrowReturn=modale.querySelector(".ajout-photo .modal-btn-arrow")


    document.getElementById("picture-error").classList.add("hidden")
    submitButton.classList.remove("green")

    trashPhotoPreview()
    trashAllFields()
    showGaleriePhotoModale(modale)
    hideModalAddMode(modale)

    arrowReturn.removeEventListener("click",returnShowGaleriePhotoModale)
    inputPhotoBtn.removeEventListener("change",previewUpload)
    form.removeEventListener("input",fieldsVerification)
    
}

export function fillCategoryForm(categories){
    const categoryForm=document.getElementById("category-selector")

    categories.forEach(categorie=>{
        const option=document.createElement("option")

        option.setAttribute("value",`${categorie.id}`)
        option.innerText=`${categorie.name}`
        categoryForm.appendChild(option)
    })
}

export function clearCategoryForm(){
    // Vidange du selecteur de catégorie
    const categoryForm=document.getElementById("category-selector")

    categoryForm.innerHTML='<option value="" selected></option>'
}

function fieldsVerification(){
    //Vérif. des champs pour passage du bouton valider en vert
    const modale=document.getElementById("modale")
    const submitButton=modale.querySelector(".validate-button")
    const inputFile=document.getElementById("input-photo")
    const inputTitle=document.getElementById("title-form")
    const inputCategory=document.getElementById("category-selector")

    console.log("i: changement dans formulaire...")

    if (inputFile.files.length && inputTitle.value.trim() && inputCategory.value){
    submitButton.classList.add("green")
    console.log("Bouton Submit: Background vert")
    }
    else {
        submitButton.classList.remove("green")
    }
    
}

export async function submitPictureForm(e,closeModal){
    e.preventDefault()//

    const inputFile=document.getElementById("input-photo").files[0]
    const inputTitle=document.getElementById("title-form").value
    const categorySelector=document.getElementById("category-selector").value
    const submitInfos=new FormData()//

    submitInfos.append("image",inputFile)
    submitInfos.append("title",inputTitle)
    submitInfos.append("category",categorySelector)

    console.log(submitInfos)

    const token=getToken()//
    const response=await fetch(`${api_URL}/api/works`,{//
        method:"POST",
        headers:{
            "Authorization":`Bearer ${token}`,
            },
        body:submitInfos//
    })

    console.log(response.status)

    const projects= await getProjects()//
    const gallery=document.querySelector(".gallery")

    effacerContenuBalise(gallery)//
    afficherProjets(projects)//
    closeModal()// 
}