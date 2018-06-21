const trasposeMatrix = function(listRow){
    listRow = listRow.map((col, i) => listRow.map(row => row[i]))
    listRow = listRow.map(row =>
      row
        .join()
        .split(',')
        .join('')
    )
  }

module.exports = {
    trasposeMatrix
}
