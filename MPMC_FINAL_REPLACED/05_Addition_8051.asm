        ORG  0000H

        MOV  A, #02H
        ADD  A, #03H
        MOV  R0, A

        CLR  A
        MOV  A, #04H
        SUBB A, #03H
        MOV  R1, A

        CLR  A
        MOV  A, #02H
        MOV  B, #03H
        MUL  AB
        MOV  R2, A

        CLR  A
        MOV  A, #06H
        MOV  B, #03H
        DIV  AB
        MOV  R3, A
        MOV  R4, B

        END
