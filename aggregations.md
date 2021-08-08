{
"aggrs": [
{
"stages": [
{
"$match": {
"first_name": {
"$var": "first_name"
}
}
},
{
"$group": {
"_id": {
"customer_type": "$customer_type",
"first_name": "$first_name",
"last_name": "$last_name"
},
"credit": {
"$sum": "$credit"
},
"debit": {
"$sum": "$debit"
}
}
},
{
"$skip": {
"$var": "@skip"
}
},
{
"$limit": {
"$var": "@limit"
}
}
],
"type": "pipeline",
"uri": "ledgerbalance"
},
{
"stages": [
{
"$group": {
"_id": null,
"credit": {
"$sum": "$credit"
},
"debit": {
"$sum": "$debit"
}
}
},
{
"$skip": {
"$var": "@skip"
}
},
{
"$limit": {
"$var": "@limit"
}
}
],
"type": "pipeline",
"uri": "totalbalance"
}
]
}
