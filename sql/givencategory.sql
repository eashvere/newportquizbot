/*
    This File contains the SQL commands if A CATEGORY is specified
*/


SELECT tossups.text, 
		tossups.formatted_answer, 
		categories.name, 
		tournaments.name 
FROM ((tossups
	   INNER JOIN tournaments ON tossups.tournament_id = tournaments.id AND tournaments.difficulty IN (2,3,4,5))
	  INNER JOIN categories ON tossups.category_id = categories.id)
WHERE tossups.formatted_answer like '%<strong>%' or position(' ' in formatted_answer) <= 0 and lower(categories.name) = lower(${category})
ORDER BY RANDOM() LIMIT ${number}