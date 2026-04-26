        ORG  0000H

        MOV  R0, #20H
        MOV  R1, #05H
        MOV  A,  #00H

UP:     MOV  B,  @R0
        CJNE A,  B, KARAN
KARAN:  JNC  A_BIG
        MOV  A,  B

A_BIG:  INC  R0
        DJNZ R1, UP

        MOV  45H, A

        END
