ORG 0000H
    MOV A, #64H
    MOV B, #0AH
    DIV AB
    MOV R0, A
    MOV R1, B
    SJMP $
END
