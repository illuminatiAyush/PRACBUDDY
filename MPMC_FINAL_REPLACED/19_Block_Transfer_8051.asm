        ORG  0000H

        MOV  R0, #20H
        MOV  R1, #27H
        MOV  R7, #05H

KARAN:  MOV  A,  @R0
        MOV  @R1, A
        INC  R0
        INC  R1
        DJNZ R7, KARAN

        END
