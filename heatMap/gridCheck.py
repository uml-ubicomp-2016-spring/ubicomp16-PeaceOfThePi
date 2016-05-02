def checkWinner(grid, lastPlay):
    for i in range(len(grid[0])):
        if all([x == lastPlay for x in grid[i]]):
		return True
        testThis =[] # Create a new array to deal with items.                   
        for k in range(len(grid)):
            testThis.append(grid[i][k])
	if all([x == lastPlay for x in testThis]):
            return True

