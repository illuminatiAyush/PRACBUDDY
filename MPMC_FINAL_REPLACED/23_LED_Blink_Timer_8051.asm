        ORG  0000H
        LJMP KARAN

KARAN:  MOV  P1, #00H
        ACALL DELAY
        MOV  P1, #0FFH
        ACALL DELAY
        SJMP KARAN

DELAY:  MOV  R2, #0FFH
D1:     MOV  R3, #0FFH
D2:     DJNZ R3, D2
        DJNZ R2, D1
        RET

        END
