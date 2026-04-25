ORG 0000H
    MOV A, #0AH
    MOV B, #05H
    MUL AB
    MOV R0, A
    MOV R1, B
    SJMP $
END
