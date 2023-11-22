//principe de l'affichage des réponses : on cache la cellule de boardGrtid pour mokntrer la case de boardgrid back avec les chiffres

let board=document.getElementById("board")
let boardBack=document.getElementById("boardBack")
let cells=document.getElementsByClassName("cell")
let boardGrid=[]
let boardGridBack=[]
let nbOfCols=5
let nbOfMines=5
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
let mines=boardGridBackShuffled.slice(0,nbOfMines)

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
        boardGridWithVisibility[coordonnees]=="hidden"
        mainCellToCalc.style.backgroundColor="red"
        Array.from(cells).forEach((cell)=>cell.style.opacity="0%")
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
            }
        })
        let classNumMainCell=null
        let obj={
            1:"un",
            2:"deux",
            3:"trois",
            4:"quatre,"
        }
        classNumMainCell=obj[countOfMinesAroundMainCell]
        mainCellToCalc.classList.add(classNumMainCell)
        mainCellToHide.classList.add("hidden")
        boardGridWithVisibility[coordonnees.join()]="hidden"
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
                    classNum=obj[count]
                    if(minesToStr.includes(neighbor.toString())==false){
                        neighborToCalc.classList.add(classNum)
                        neighborToHide.classList.add("hidden")
                        boardGridWithVisibility[neighbor.join()]="hidden"
                    }
                })
            })
        
        //Si la case cliquée n'a aucune mine autour, dévoiler tous les voisins de la case cliquée
        if (neighbours.every((item)=>(minesToStr.includes(item.toString())==false))){
            neighbours.forEach((neighbor)=>{
                let neighborToHide=document.querySelector(`#${neighbor.join().replace(',','-')}`)
                neighborToHide.classList.add("hidden")
                boardGridWithVisibility[neighbor.join()]="hidden"
            })
        }
    }
    evalVictory()
}

//Générer le board en html
boardGrid.forEach((coordonnees)=>{
    let cell=document.createElement("img")
    let pictureOfCell="hamb.png"
    let flagIsPlaced=false
    let questionMarkIsPlaced=false
    cell.setAttribute("class","cell")
    cell.setAttribute("id",coordonnees.join().replace(',','-'))// need to replace ',' with '-' to have a valid ID
    cell.setAttribute("src","hamb.png")
    cell.addEventListener("mousedown",()=>{
        cell.setAttribute("src","sous-le-choc.png")        
    })
    cell.addEventListener("mouseup",()=>{
        cell.setAttribute("src",pictureOfCell) ;
    })
    cell.addEventListener("mouseover",()=>{
        cell.setAttribute("src","sourire.png")
    })
    cell.addEventListener("mouseout",()=>{
        cell.setAttribute("src",pictureOfCell) ;
    })
    cell.addEventListener("click",()=>{
        calcAndDisplayOfNeighbours(coordonnees)})
    cell.addEventListener("contextmenu",(e)=>{
            e.preventDefault()
        if (flagIsPlaced==false) {
            cell.setAttribute("src","flag.png") ;
            flagIsPlaced=true
            questionMarkIsPlaced=false
            pictureOfCell="flag.png"
        }
        else if (flagIsPlaced==true && questionMarkIsPlaced==false){
            questionMarkIsPlaced=true
            cell.setAttribute("src","help.png") ;
            pictureOfCell="help.png"
        }
        else{
            questionMarkIsPlaced=false
            flagIsPlaced=false
            cell.setAttribute("src","hamb.png") ;
            pictureOfCell="hamb.png"
        }
    })    
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

//Tester la victoire : si le nb de cellules hidden==nb de mines et toutes les cells sont hidden sauf les mines 
    // 
    let boardGridWithVisibility={}
    boardGrid.forEach((cell)=>(boardGridWithVisibility[cell] ="visible"))
    let minesToStr=mines.map((item)=>(item.join())).sort()
    function evalVictory(){
        let arrFromBoardGridVis
        arrFromBoardGridVis=Object.entries(boardGridWithVisibility)
        let arrOfVisible=arrFromBoardGridVis.filter((item)=>(item[1]=="visible")).map((item)=>(item[0]))
            console.log("arrofvis",arrOfVisible)
            console.log("mines",minesToStr)
        if (arrOfVisible.length==nbOfMines){
          arrOfVisible.every((item,index)=>(item==minesToStr[index]))==true 
          ? alert ("gagné!")
          : alert ("y a qqch qui bug!")
        }
    }


