CANDIDATE TEST
==============

#### Situation

Your client is a fruits company. They have a ledger where they track purchases and sales from their warehouse.

The data is available as a file that can be loaded from here:

[https://c-test-0701.glitch.me/data.txt](https://c-test-0701.glitch.me/data.txt)

Each line represents one purchase (indicated by "P" in the first column) or sale (indicated by "S").

For example, after this transaction:
```
P Apple (red)         10 kg        $5
```
... the warehouse will have 10kg of red apples more in stock and will be $50 poorer ($5 per kg, multiplied by 10 kilograms).

The data is maintained by hand and cannot be assumed to be 100% consistent. The owner, however, swears that columns are aligned vertically and that all the product names are correctly spelled.

#### Your task

Write a program that loads the raw data from the URL above, parses it and generates a report that looks like this:

```text
Product name         Final stock         Final balance
=========================================================
Apple (green)        ??? kg              + $???
Apple (red)          ??? kg              - $???
...
```
First column is product name.

Second column is the amount of each product in the warehouse at the end of the ledger (represented in kilograms).

Third column is total balance of all incomes and expenses at the end, positive or negative.

The final report should be sorted by the final balance, from biggest profits to biggest losses.

#### Remarks

- The code should be written using the practices you would use in your production code (not a "just get it working" problem)

- Preferably, the code should be as flexible as possible and capable of handling additional (poorly formatted) rows added to the input dataset

- You are allowed to use Google or any other internet resource you need.

