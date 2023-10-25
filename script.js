//principe de l'affichage des réponses : on cache la cellule de boardGrtid pour mokntrer la case de boardgrid back avec les chiffres

let board=document.getElementById("board")
let boardBack=document.getElementById("boardBack")
let boardGrid=[]
let boardGridBack=[]
let nbOfCols=5
let nbOfCells=Math.pow(nbOfCols,2)
let boardCol=["A","B","C","D","E"]

//Générer un tableau de nbOfCols au carré cases, en faire une copie
boardCol.forEach((letter)=>{
for (let i=1 ; i<nbOfCols+1 ; i++){
let cell=[letter,i]
boardGrid.push(cell)}
})
let boardGridShuffled=[...boardGrid]

//Mélanger le tableau
const shuffle = (array) => { 
    for (let i = array.length - 1; i > 0; i--) { 
      const j = Math.floor(Math.random() * (i + 1)); 
      [array[i], array[j]] = [array[j], array[i]]; 
    } 
    return array; 
  }; 
shuffle(boardGridShuffled)

//Choisir une case au hasard où 0<=x<nbOfCells ( c'est pour ça qu'on utilise floor plutôt que cell)
let x=Math.floor((Math.random()*24))
let cible=boardGridShuffled[x]

//Génère le board à l'arrière
boardGridBack=boardGrid.map(item=>(item)) //copier le boardgrid pour avoir la même grille

//Faire une deep copie et mélanger boardGridBack
let boardGridBackShuffled=[...boardGridBack]
shuffle(boardGridBackShuffled)
let mines=boardGridBackShuffled.slice(0,nbOfCols)

//Calcul des cases voisines et filtre des cas limites
function calcAndDisplayOfNeighbours(coordonnees){
    let neighbours
    function calcNeighbours(coordonnees) {
        //en général :
        let neighborLeft=[coordonnees[0],coordonnees[1]-1]
        let neighborRight=[coordonnees[0],coordonnees[1]+1]
        let neighborTopLeft=[boardCol[boardCol.indexOf(`${coordonnees[0]}`)-1],coordonnees[1]-1]
        let neighborTopMiddle=[boardCol[boardCol.indexOf(`${coordonnees[0]}`)-1],coordonnees[1]]
        let neighborTopRight=[boardCol[boardCol.indexOf(`${coordonnees[0]}`)-1],coordonnees[1]+1]
        let neighborBottomLeft=[boardCol[boardCol.indexOf(`${coordonnees[0]}`)+1],coordonnees[1]-1]
        let neighborBottomMiddle=[boardCol[boardCol.indexOf(`${coordonnees[0]}`)+1],coordonnees[1]]
        let neighborBottomRight=[boardCol[boardCol.indexOf(`${coordonnees[0]}`)+1],coordonnees[1]+1]
        neighbours=[neighborTopLeft,neighborTopMiddle,neighborTopRight,neighborLeft,neighborRight,neighborBottomLeft,neighborBottomMiddle,neighborBottomRight]
        //cas particuliers
        let neighboursFiltered=neighbours.filter((coordonnees)=>{
                if(coordonnees[0]==undefined || coordonnees[1]==0 ||coordonnees[1]>nbOfCols ) 
                return false
                else {return true}
            })
        neighbours=neighboursFiltered
        return neighbours
    }    
    calcNeighbours(coordonnees)
    //Comportement au clic de l'affichage des cellules
    let mainCellCoord=`#${coordonnees.join().replace(',','-')}`
    let mainCellToHide=document.querySelector(mainCellCoord)
    let mainCellToCalc=document.querySelector(`${mainCellCoord}-back`)
    let minesToStr=mines.map((mine)=>(mine.toString())) //cvertir chq item du tabl en str pour le rechercher
    
    //Si la case cliquée contient une mine
    if (minesToStr.includes(coordonnees.toString())==true) {
        mainCellToHide.classList.add("hidden") 
        mainCellToCalc.style.backgroundColor="red"
        board.style.opacity="O%"///pquoi ça marche pas ??
        mainCellToCalc.classList.add("bomb")
        alert("perdu")
    }
    //Sinon dévoiler la case cliquée en ayant calculé son score au préalable
    else {
        let countOfMinesAroundMainCell=0
        neighbours.forEach((neighbor)=>{
            if(minesToStr.includes(neighbor.toString())==true) {
                countOfMinesAroundMainCell++ ;
                console.log("countOfMinesAroundMainCell",countOfMinesAroundMainCell)
            }
        })
        let classNumMainCell=null
        //Fonction pour trouver la class à affocher selon le nb de mine de la case
                    function chooseClassNum(htmlClass,countOfMines){
                        switch (countOfMines) {
                            case 1:
                                htmlClass="un"
                            break;
                            case 2:
                                htmlClass="deux"    
                            break;
                            case 3:
                                htmlClass="trois"    
                            break;
                            case 4:
                                htmlClass="quatre"    
                            break;
                            default:
                        }   
                    
                    }
                    chooseClassNum(classNumMainCell,countOfMinesAroundMainCell)
                    
                    mainCellToCalc.classList.add(classNumMainCell)
        mainCellToHide.classList.add("hidden")
        // Calculer les chiffres crrspdt aux nb de mines autour de chq voisin 
            neighbours.forEach((neighbor)=>{
                let neighboursOfNeighbor=calcNeighbours(neighbor)
                let count=0
                neighboursOfNeighbor.forEach((neighborOfNeighbor)=>{           
                    if(minesToStr.includes(neighborOfNeighbor.toString())==true) {
                        count++ ;
                    }
                    let neighborToHide=document.querySelector(`#${neighbor.join().replace(',','-')}`)
                    let neighborToCalc=document.querySelector(`#${neighbor.join().replace(',','-')}-back`)
                        //Switcher selon le nb de mines
                    let classNum=null
                    switch (count) {
                        case 1:
                        classNum="un"
                        break;
                        case 2:
                        classNum="deux"    
                        break;
                        case 3:
                        classNum="trois"    
                        break;
                        case 4:
                        classNum="quatre"    
                        break;
                        default:
                    }   
                    if(minesToStr.includes(neighbor.toString())==false){
                        neighborToCalc.classList.add(classNum)
                        neighborToHide.classList.add("hidden")
                    }
                })
            })
        
        //Si la case cliquée n'a aucune mine autour, dévoiler tous les voisins de la case cliquée
        if (neighbours.every((item)=>(minesToStr.includes(item.toString())==false))){
            neighbours.forEach((neighbor)=>{
                let neighborToHide=document.querySelector(`#${neighbor.join().replace(',','-')}`)
                neighborToHide.classList.add("hidden")
            })
        }
    }
}

//Générer le board en html
boardGrid.forEach((coordonnees)=>{
    let cell=document.createElement("img")
    cell.setAttribute("class","cell")
    cell.setAttribute("id",coordonnees.join().replace(',','-'))// need to replace ',' with '-' to have a valid ID
    cell.setAttribute("src","hamb.png")
    cell.addEventListener("mousedown",()=>{
        cell.setAttribute("src","sous-le-choc.png")        
    })
    cell.addEventListener("mouseup",()=>{
        cell.setAttribute("src","hamb.png") ;
    })
    cell.addEventListener("mouseover",()=>{
        cell.setAttribute("src","sourire.png")
    })
    cell.addEventListener("mouseout",()=>{
        cell.setAttribute("src","hamb.png") ;
    })
    cell.addEventListener("click",()=>{
        calcAndDisplayOfNeighbours(coordonnees)})
    //ce qui se passe quand on relache le bouton de la souris, les cases voisines se dévoilent
    
    
    board.appendChild(cell)
})



//Génerer la grille 
boardGridBack.forEach((coordonnees)=>{
    //générer l'html
    let cell=document.createElement("div")
    let boardGridBackCellCoord=`${coordonnees.join().replace(',','-')}-back`
    cell.setAttribute("class","cellBackground")
    cell.setAttribute("id",boardGridBackCellCoord)
    // cell.appendChild(text)
    boardBack.appendChild(cell)
    //affichage en fct de la situation des mines
    let cellCss=document.querySelector(`#${boardGridBackCellCoord}`)
    if(mines.includes(coordonnees)==true) {//pquoi c amarche ici ?
        cellCss.classList.add("bomb")}

})

