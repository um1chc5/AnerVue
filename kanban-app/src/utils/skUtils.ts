export const getColIdFromTaskId = (task_id: string) => {
  const firstHashIndex = task_id.indexOf('#')
  const secondHashIndex = task_id.indexOf('#', firstHashIndex + 1)

  // Check if both '#' are found
  if (firstHashIndex !== -1 && secondHashIndex !== -1) {
    // Extract the substring between the first and second '#'
    const extractedSubstring = task_id.substring(firstHashIndex + 1, secondHashIndex)

    // Construct the result string
    const result = `col#${extractedSubstring}`

    return result
  } else {
    // Handle the case where one or both '#' are not found
    console.error('Invalid input format. Both "#" symbols are required.')
    return null
  }
}
