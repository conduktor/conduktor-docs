---
sidebar_position: 3
---

# Check Operators

Depending on the type of the data you are testing, there are a range of different operators available for checks. Below details the operators for each distinct data type.

## String <a href="#string" id="string"></a>

| Operator             | Description                                                                                                                            |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| matches              | Returns true if the string **matches** the provided regular expression pattern. Note this uses the **Java 8** regex flavor.            |
| does not match       | Returns true if the the string **does not match** the provided regular expression pattern. Note this uses the **Java 8** regex flavor. |
| is null              | Returns true if the string **is null**                                                                                                 |
| is not null          | Returns true if the string **is not null**                                                                                             |
| equals               | Returns true if the string **equals** a provided value                                                                                 |
| does not equal       | Returns true if the string **does not** **equal** a provided value                                                                     |
| contains             | Returns true if the string **contains** the provided value                                                                             |
| does not contain     | Returns true if the string **does not contain** the provided value                                                                     |
| ends with            | Returns true if the string **ends with** the provided value                                                                            |
| does not end with    | Returns true if the string **does not end with** the provided value                                                                    |
| has length           | Returns true if the string **has length** of the specified value                                                                       |
| does not have length | Returns true if the string **does not have length** of the specified value                                                             |
| starts with          | Returns true if the string **starts with** the specified value                                                                         |
| does not start with  | Returns true if the string **does not** **start with** the specified value                                                             |

## Number

| Operator                 | Description                                                                    |
| ------------------------ | ------------------------------------------------------------------------------ |
| is null                  | Returns true if the number **is null**                                         |
| is not null              | Returns true if the number **is not null**                                     |
| is greater than          | Returns true if the number **is greater than** the specified value             |
| is greater than or equal | Returns true if the number **is greater than or equal to** the specified value |
| is less than             | Returns true if the number **is less than** the specified value                |
| is less than or equal    | Returns true if the number **is less than or equal to** the specified value    |
| equals                   | Returns true if the number **equals** the specified value                      |
| doest not equal          | Returns true if the number **does not equal** the specified value              |

## Date/Time

| Operator           | Description                                                                |
| ------------------ | -------------------------------------------------------------------------- |
| is null            | Returns true if the date **is null**                                       |
| is not null        | Returns true if the date **is not null**                                   |
| is before          | Returns true if the date **is before** the specified date/time             |
| is before or equal | Returns true if the date **is before or equal to** the specified date/time |
| is after           | Returns true if the date **is after** the specified date/time              |
| is after or equal  | Returns true if the date **is after or equal to** the specified date/time  |
| equals             | Returns true if the date **equals** the specified date/time                |
| does not equal     | Returns true if the date **does not** **equals** the specified date/time   |

## List

| Operator             | Description                                                                                |
| -------------------- | ------------------------------------------------------------------------------------------ |
| is null              | Returns true if the list **is null**                                                       |
| is not null          | Returns true if the list **is not null**                                                   |
| exists               | Returns true if the specified value **exists** in the list                                 |
| does not exist       | Returns true if the specified value **does not exist** in the list                         |
| for all              | Returns true if each element in the list **passes the provided test**                      |
| not all              | Returns true if each element in the list **does not pass the provided test**               |
| has same elements    | Returns true if the list **has the same elements** as the provided list           |
| not same elements    | Returns true if the list **does not have the same elements** as the provided list |
| has subset           | Returns true if the list **has a subset** of the provided list items                       |
| does not have subset | Returns true if the list **does not have a subset** of the provided list items             |
| contains             | Returns true if the list **contains** the provided value                                   |
| does not contain     | Returns true if the list **does not contain** the provided value                           |
| has length           | Returns true if the list **has length** of the specified value                             |
| does not have length | Returns true if the list **does not have length** of the specified value                   |
| equals               | Returns true if the list **equals** the specified value                                    |
| does not equal       | Returns true if the list **does not equal** the specified value                            |

## Map/Object

| Operator            | Description                                                                          |
| ------------------- | ------------------------------------------------------------------------------------ |
| is null             | Returns true if the map/object **is null**                                           |
| is not null         | Returns true if the map/object **is not null**                                       |
| contains            | Returns true if the map/object **contains** the specified value                      |
| does not contain    | Returns true if the map/object **does not contain** the specified value              |
| has key             | Returns true if the map/object **has the key** that's specified             |
| does not have key   | Returns true if the map/object **does not have the key** that's specified   |
| has value           | Returns true if the map/object **has the value** that's specified           |
| does not have value | Returns true if the map/object **does not have the value** that's specified |
| equals              | Returns true if the map/object **equals** the specified value                        |
| does not equal      | Returns true if the map/object **does not** **equal** the specified value            |

## Boolean

| Operator | Description                                    |
| -------- | ---------------------------------------------- |
| is true  | Returns true if the boolean value **is true**  |
| is false | Returns true if the boolean value **is false** |
