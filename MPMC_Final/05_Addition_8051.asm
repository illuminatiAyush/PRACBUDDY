ORG 0000H
    MOV R0, #25H
    MOV R1, #15H
    MOV A, R0
    ADD A, R1
    MOV R2, A
    MOV R3, #00H
    JNC DONE
    INC R3
DONE:
    SJMP $
END
