ORG 0000H
    MOV R0, #05H
    MOV A, #01H
FACT:
    MOV B, A
    MOV A, R0
    MUL AB
    DJNZ R0, FACT
    MOV 30H, A
    MOV 31H, B
    SJMP $
END
