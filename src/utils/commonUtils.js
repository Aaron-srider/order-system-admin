export function deleteItemFromList(targetList, listItemFieldName, searchValue) {
  const listItemIndex2BeDeleted = targetList.findIndex((item) => item[listItemFieldName] == searchValue)
  targetList.splice(listItemIndex2BeDeleted, 1)
}
